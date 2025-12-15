# 💬 Module 21: Messaging System

> **Module tin nhắn giữa users**
> 
> File: `21-MODULE-MESSAGING.md`  
> Version: 1.0  
> Last Updated: 15/12/2024

---

## Giới thiệu

Messaging System cho phép:
- Student ↔ Teacher: Hỏi bài, trao đổi
- Student ↔ Student: Học nhóm (optional)
- Class Group Chat: Thảo luận lớp học
- Support Ticket: Student ↔ Admin

---

## Features

### 1. Direct Messages

```tsx
<DirectMessage>
  <ConversationList>
    <Search placeholder="Tìm kiếm..." />
    
    <Conversations>
      <ConversationItem active>
        <Avatar src={user.avatar} />
        <Info>
          <Name>{user.name}</Name>
          <LastMessage>Cảm ơn thầy...</LastMessage>
          <Time>5 phút trước</Time>
        </Info>
        <UnreadBadge>2</UnreadBadge>
      </ConversationItem>
      
      {/* More conversations */}
    </Conversations>
  </ConversationList>
  
  <ChatWindow>
    <Header>
      <Avatar src={selectedUser.avatar} />
      <Name>{selectedUser.name}</Name>
      <Status>Online</Status>
    </Header>
    
    <MessageList>
      <Message from="them">
        <Text>Em có thể hỏi về bài tập không ạ?</Text>
        <Time>10:30 AM</Time>
      </Message>
      
      <Message from="me">
        <Text>Dạ được em, em hỏi đi</Text>
        <Time>10:32 AM</Time>
      </Message>
    </MessageList>
    
    <MessageInput>
      <Input placeholder="Nhắn tin..." />
      <AttachButton />
      <SendButton />
    </MessageInput>
  </ChatWindow>
</DirectMessage>
```

---

### 2. Class Group Chat

```tsx
<ClassGroupChat>
  <Header>
    <Title>{className}</Title>
    <MemberCount>{memberCount} members</MemberCount>
  </Header>
  
  <MessageList>
    <SystemMessage>
      <Text>Teacher added material "Grammar Review"</Text>
      <Time>Yesterday</Time>
    </SystemMessage>
    
    <Message from="teacher">
      <Avatar />
      <Name>Teacher John</Name>
      <Text>Các em làm bài tập về nhà nhé</Text>
      <Time>2:30 PM</Time>
    </Message>
    
    <Message from="student">
      <Avatar />
      <Name>Nguyễn Văn A</Name>
      <Text>Dạ em đã làm xong ạ</Text>
      <Time>3:00 PM</Time>
    </Message>
  </MessageList>
  
  <MessageInput>
    <Input placeholder="Nhắn tin vào nhóm..." />
    <SendButton />
  </MessageInput>
</ClassGroupChat>
```

---

### 3. Message Types

**Text Message**:
```json
{
  "type": "text",
  "content": "Hello world"
}
```

**File Attachment**:
```json
{
  "type": "file",
  "fileName": "homework.pdf",
  "fileUrl": "https://...",
  "fileSize": 1024000
}
```

**System Message**:
```json
{
  "type": "system",
  "content": "Student joined the class"
}
```

---

## Database Design

### Table: conversations

```sql
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type VARCHAR(20) NOT NULL,
  -- 'direct' | 'group' | 'class'
  
  class_id UUID REFERENCES classes(id),
  -- Only for class conversations
  
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  last_message_at TIMESTAMP DEFAULT NOW()
);
```

### Table: conversation_participants

```sql
CREATE TABLE conversation_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  last_read_at TIMESTAMP,
  muted BOOLEAN DEFAULT FALSE,
  
  joined_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(conversation_id, user_id)
);
```

### Table: messages

```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id) ON DELETE SET NULL,
  
  type VARCHAR(20) DEFAULT 'text',
  -- 'text' | 'file' | 'system'
  
  content TEXT NOT NULL,
  metadata JSONB,
  -- For file attachments, links, etc.
  
  is_edited BOOLEAN DEFAULT FALSE,
  edited_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id, created_at DESC);
CREATE INDEX idx_messages_sender ON messages(sender_id);
```

---

## API Endpoints

### GET /api/conversations

Get user's conversations

**Response**:
```json
{
  "conversations": [
    {
      "id": "uuid",
      "type": "direct",
      "otherUser": {
        "id": "uuid",
        "name": "Teacher John",
        "avatar": "..."
      },
      "lastMessage": {
        "content": "Cảm ơn thầy",
        "sentAt": "2024-12-15T10:30:00Z"
      },
      "unreadCount": 2
    }
  ]
}
```

### POST /api/conversations

Create new conversation

**Request**:
```json
{
  "type": "direct",
  "participantIds": ["uuid1", "uuid2"]
}
```

### GET /api/conversations/:id/messages

Get messages

**Query**: `?before=timestamp&limit=50`

### POST /api/conversations/:id/messages

Send message

**Request**:
```json
{
  "type": "text",
  "content": "Hello!"
}
```

### PUT /api/conversations/:id/read

Mark as read

---

## Real-time Updates

### WebSocket Events

```typescript
// Join conversation room
socket.emit('join-conversation', { conversationId });

// Listen for new messages
socket.on('new-message', (message) => {
  // Add to message list
  // Show notification if window not focused
});

// Typing indicator
socket.emit('typing', { conversationId });
socket.on('user-typing', ({ userId, userName }) => {
  // Show "User is typing..."
});
```

---

## Features

### Typing Indicator

```tsx
<TypingIndicator>
  <Avatar />
  <Text>{userName} is typing...</Text>
  <DotAnimation />
</TypingIndicator>
```

### Read Receipts

```tsx
<Message>
  <Content>Hello!</Content>
  <Status>
    {sent && <CheckIcon />}
    {delivered && <DoubleCheckIcon />}
    {read && <DoubleCheckIcon color="blue" />}
  </Status>
</Message>
```

### File Sharing

```tsx
<FileMessage>
  <FileIcon type={file.type} />
  <FileName>{file.name}</FileName>
  <FileSize>{formatSize(file.size)}</FileSize>
  <DownloadButton />
</FileMessage>
```

---

## Kết thúc Module Messaging

Tích hợp với Module 06 (Class), Module 20 (Notifications), real-time WebSocket.
