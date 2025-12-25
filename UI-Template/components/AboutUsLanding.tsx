import { useState } from 'react';
import { X, ChevronDown, Sparkles, Brain, Trophy, Users, Calendar, DollarSign, BookOpen, Award, Video, FileText, Mic, PenTool, Target, BarChart, MessageSquare, GraduationCap, Building2, Star, ArrowRight, Volume2, Headphones, Check, Zap, Globe, Shield, Clock, TrendingUp, Mail, Phone, MapPin, Facebook, Youtube, Linkedin, Instagram, Eye, CreditCard, Wallet } from 'lucide-react';
import { FreePlanDashboard } from './FreePlanDashboard';
import { copyToClipboard } from '../utils/clipboard';

interface AboutUsLandingProps {
  onBack: () => void;
  onNavigateToBlog?: () => void;
  onNavigateToAuth?: (page: 'login' | 'register') => void;
}

export function AboutUsLanding({ onBack, onNavigateToBlog, onNavigateToAuth }: AboutUsLandingProps) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<'courses' | 'ai-hub' | 'free-tests' | 'resources' | 'feedback' | 'teachers' | 'partners' | 'events' | 'pricing' | null>(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showFreeTrialModal, setShowFreeTrialModal] = useState(false);
  const [showFreeRegisterModal, setShowFreeRegisterModal] = useState(false);
  const [showEmailVerifyModal, setShowEmailVerifyModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showFreePlanDashboard, setShowFreePlanDashboard] = useState(false);
  const [showCourseDetailModal, setShowCourseDetailModal] = useState(false);
  const [loggedInEmail, setLoggedInEmail] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  const [freeRegisterData, setFreeRegisterData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [otpCode, setOtpCode] = useState('');
  const [formErrors, setFormErrors] = useState<any>({});
  const [freeRegisterErrors, setFreeRegisterErrors] = useState<any>({});
  const [loginErrors, setLoginErrors] = useState<any>({});
  const [paymentData, setPaymentData] = useState({
    duration: 1, // 1, 3, 6, 12 months
    autoRenew: false,
    paymentMethod: 'bank' // only 'bank' transfer now
  });

  // Toggle dropdown
  const toggleDropdown = (menu: string) => {
    setActiveDropdown(activeDropdown === menu ? null : menu);
  };

  // Navigate to section
  const navigateToSection = (section: 'courses' | 'ai-hub' | 'free-tests' | 'resources' | 'feedback' | 'teachers' | 'partners' | 'events' | 'pricing') => {
    setActiveSection(section);
    setActiveDropdown(null);
    // Scroll to section
    const element = document.getElementById(`section-${section}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Validate Free Registration
  const validateFreeRegister = () => {
    const errors: any = {};
    
    if (!freeRegisterData.fullName.trim()) {
      errors.fullName = 'Vui lòng nhập họ tên';
    }
    
    if (!freeRegisterData.email.trim()) {
      errors.email = 'Vui lòng nhập email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(freeRegisterData.email)) {
      errors.email = 'Email không hợp lệ';
    }
    
    if (!freeRegisterData.phone.trim()) {
      errors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^[0-9]{10}$/.test(freeRegisterData.phone)) {
      errors.phone = 'Số điện thoại không hợp lệ (10 chữ số)';
    }
    
    if (!freeRegisterData.password) {
      errors.password = 'Vui lòng nhập mật khẩu';
    } else if (freeRegisterData.password.length < 6) {
      errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    
    if (!freeRegisterData.confirmPassword) {
      errors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
    } else if (freeRegisterData.password !== freeRegisterData.confirmPassword) {
      errors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }
    
    setFreeRegisterErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle Free Registration Submit
  const handleFreeRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateFreeRegister()) {
      // Simulate API call
      setShowFreeRegisterModal(false);
      setShowEmailVerifyModal(true);
      // In real app, send verification email here
    }
  };

  // Handle OTP Verification
  const handleVerifyOTP = () => {
    if (!otpCode || otpCode.length !== 6) {
      alert('Vui lòng nhập mã OTP 6 chữ số');
      return;
    }
    
    // Simulate OTP verification
    if (otpCode === '123456') {
      setShowEmailVerifyModal(false);
      setShowLoginModal(true);
      setOtpCode('');
      alert('✅ Xác thực thành công! Vui lòng đăng nhập để tiếp tục.');
    } else {
      alert('❌ Mã OTP không chính xác. Vui lòng thử lại.');
    }
  };

  // Validate Login
  const validateLogin = () => {
    const errors: any = {};
    
    if (!loginData.email.trim()) {
      errors.email = 'Vui lòng nhập email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginData.email)) {
      errors.email = 'Email không hợp lệ';
    }
    
    if (!loginData.password) {
      errors.password = 'Vui lòng nhập mật khẩu';
    }
    
    setLoginErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle Login Submit - DEMO MODE: Accept any email/password
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateLogin()) {
      // DEMO MODE: Accept any email and password
      setShowLoginModal(false);
      setLoggedInEmail(loginData.email);
      setShowFreePlanDashboard(true);
      
      // Reset forms
      setLoginData({ email: '', password: '' });
    }
  };

  // Handle course detail modal
  const openCourseDetailModal = (course: any) => {
    setSelectedCourse(course);
    setShowCourseDetailModal(true);
  };

  // Handle register modal
  const openRegisterModal = (course: any) => {
    setSelectedCourse(course);
    setShowRegisterModal(true);
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      agreeTerms: false
    });
    setFormErrors({});
  };

  const closeRegisterModal = () => {
    setShowRegisterModal(false);
    setSelectedCourse(null);
  };

  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors((prev: any) => ({ ...prev, [name]: '' }));
    }
  };

  // Validate form
  const validateForm = () => {
    const errors: any = {};
    
    if (!formData.fullName.trim()) {
      errors.fullName = 'Vui lòng nhập họ tên';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Vui lòng nhập email';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email không hợp lệ';
    }
    
    if (!formData.phone.trim()) {
      errors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/\s/g, ''))) {
      errors.phone = 'Số điện thoại phải có 10 chữ số';
    }
    
    if (!formData.password) {
      errors.password = 'Vui lòng nhập mật khẩu';
    } else if (formData.password.length < 6) {
      errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Mật khẩu không khớp';
    }
    
    if (!formData.agreeTerms) {
      errors.agreeTerms = 'Vui lòng đồng ý với điều khoản';
    }
    
    return errors;
  };

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    // Success - process payment immediately
    const totalPrice = calculateTotalPrice();
    alert(`🎉 Đăng ký và Thanh toán thành công!\n\nKhóa học: ${selectedCourse.name}\nHọ tên: ${formData.fullName}\nEmail: ${formData.email}\nThời hạn: ${paymentData.duration} tháng\nPhương thức: Chuyển khoản ngân hàng\nTổng tiền: ${totalPrice.toLocaleString()}đ\n\nVui lòng chuyển khoản theo thông tin đã hiển thị. Tài khoản sẽ được kích hoạt tự động sau 5-10 phút!`);
    setShowRegisterModal(false);
    setSelectedCourse(null);
    // Reset payment data
    setPaymentData({
      duration: 1,
      autoRenew: false,
      paymentMethod: 'bank'
    });
  };

  // Handle payment
  const handlePayment = () => {
    const totalPrice = calculateTotalPrice();
    alert(`🎉 Thanh toán thành công!\n\nKhóa học: ${selectedCourse.name}\nHọ tên: ${formData.fullName}\nThời hạn: ${paymentData.duration} tháng\nTổng tiền: ${totalPrice.toLocaleString()}đ\n\nVui lòng chuyển khoản theo thông tin đã hiển thị. Tài khoản sẽ được kích hoạt tự động sau 5-10 phút!`);
    setShowPaymentModal(false);
    setSelectedCourse(null);
    // Reset payment data
    setPaymentData({
      duration: 1,
      autoRenew: false,
      paymentMethod: 'bank'
    });
  };

  // Calculate price with discount
  const calculateTotalPrice = () => {
    if (!selectedCourse) return 0;
    const basePrice = parseInt(selectedCourse.price.replace(/[.,đ]/g, ''));
    const discounts: { [key: number]: number } = {
      1: 0,
      3: 0.05,
      6: 0.10,
      12: 0.20
    };
    const discount = discounts[paymentData.duration] || 0;
    return Math.round(basePrice * paymentData.duration * (1 - discount));
  };

  // Course data
  const courses = [
    {
      id: 1,
      name: 'VSTEP Complete',
      emoji: '🎯',
      badge: 'Complete',
      badgeColor: 'bg-cyan-100 text-cyan-700',
      level: 'A2-C1',
      duration: '10 tuần',
      lessons: 10,
      sessions: 10,
      price: '1,500,000đ',
      students: 856,
      rating: 4.9,
      reviews: 324,
      description: 'Khóa học toàn diện từ A2 đến C1, bao gồm đầy đủ 4 kỹ năng với lộ trình học cá nhân hóa.',
      features: ['10 bài học chi tiết', '200+ bài tập thực hành', 'AI chấm điểm tự động', 'Giáo viên hỗ trợ 1-1'],
      color: 'from-blue-500 to-cyan-600',
      instructor: {
        name: 'TS. Nguyễn Minh Tuấn',
        title: 'Chuyên gia VSTEP 15 năm kinh nghiệm',
        avatar: '👨‍🏫'
      },
      curriculum: [
        { week: 1, title: 'Foundation Skills', topics: ['Grammar basics', 'Vocabulary building', 'Listening fundamentals'] },
        { week: 2, title: 'Reading Comprehension', topics: ['Skimming & Scanning', 'Main ideas', 'Detail questions'] },
        { week: 3, title: 'Writing Skills Level 1', topics: ['Task 1: Email writing', 'Sentence structures', 'Common phrases'] },
        { week: 4, title: 'Speaking Basics', topics: ['Self-introduction', 'Daily topics', 'Pronunciation'] },
        { week: 5, title: 'Intermediate Listening', topics: ['Note-taking', 'Conversations', 'Academic lectures'] },
        { week: 6, title: 'Advanced Reading', topics: ['Inference questions', 'Vocabulary in context', 'Speed reading'] },
        { week: 7, title: 'Writing Skills Level 2', topics: ['Task 2: Essay writing', 'Argument development', 'Coherence'] },
        { week: 8, title: 'Speaking Fluency', topics: ['Opinion expression', 'Discussions', 'Presentations'] },
        { week: 9, title: 'Mock Test 1', topics: ['Full 4-skill test', 'AI feedback', 'Score analysis'] },
        { week: 10, title: 'Final Review & Test', topics: ['Exam strategies', 'Final mock test', 'Certificate'] }
      ],
      benefits: [
        'Lộ trình học cá nhân hóa dựa trên trình độ đầu vào',
        'Chấm điểm AI tự động cho cả 4 kỹ năng với feedback chi tiết',
        '200+ bài tập thực hành đa dạng theo format VSTEP chuẩn',
        'Giáo viên hỗ trợ 1-1 qua chat và video call',
        'Tài liệu học tập độc quyền và cập nhật liên tục',
        'Chứng chỉ hoàn thành khóa học có giá trị'
      ],
      outcomes: [
        'Nắm vững cấu trúc đề thi VSTEP từ A2 đến C1',
        'Đạt band điểm mục tiêu theo nhu cầu cá nhân',
        'Tự tin giao tiếp tiếng Anh trong mọi tình huống',
        'Kỹ năng tự học và luyện tập hiệu quả'
      ],
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      studentReviews: [
        { name: 'Nguyễn Văn A', avatar: '👨', rating: 5, date: '2 tuần trước', comment: 'Khóa học rất chi tiết và dễ hiểu. Giảng viên nhiệt tình, AI chấm điểm cực kỳ chính xác. Mình đã đạt B2 sau 10 tuần học!' },
        { name: 'Trần Thị B', avatar: '👩', rating: 5, date: '1 tháng trước', comment: 'Lộ trình học rất khoa học, từ dễ đến khó. Tài liệu phong phú, bài tập đa dạng. Recommend cho ai muốn học VSTEP hiệu quả.' },
        { name: 'Lê Minh C', avatar: '👨‍💼', rating: 4, date: '3 tuần trước', comment: 'Chất lượng tốt, giá hợp lý. Hỗ trợ 1-1 rất tận tâm. Chỉ tiếc là chưa có thêm nhiều mock test hơn.' },
        { name: 'Phạm Thu D', avatar: '👩‍🎓', rating: 5, date: '1 tuần trước', comment: 'Tuyệt vời! Từ A2 mình đã lên B2+ trong 10 tuần. AI feedback rất chi tiết giúp mình biết được lỗi sai để cải thiện.' }
      ]
    },
    {
      id: 2,
      name: 'VSTEP Master',
      emoji: '🏆',
      badge: 'Master',
      badgeColor: 'bg-yellow-100 text-yellow-700',
      level: 'B1-C1',
      duration: '30 tuần',
      lessons: 30,
      sessions: 30,
      price: '3,500,000đ',
      students: 678,
      rating: 4.7,
      reviews: 289,
      description: 'Chương trình đào tạo chuyên sâu để đạt trình độ thành thạo tiếng Anh.',
      features: ['30 bài học chuyên sâu', '500+ bài tập đa dạng', 'Mock tests hàng tuần', 'Mentoring 1-1'],
      color: 'from-yellow-500 to-orange-600',
      instructor: {
        name: 'ThS. Lê Thu Hà',
        title: 'Giảng viên Đại học Ngoại ngữ',
        avatar: '👩‍🏫'
      },
      curriculum: [
        { week: '1-5', title: 'B1 Level Mastery', topics: ['Intermediate grammar', 'Academic vocabulary', 'VSTEP B1 practice'] },
        { week: '6-10', title: 'B2 Level Foundation', topics: ['Complex structures', 'Essay writing', 'Advanced listening'] },
        { week: '11-15', title: 'B2 Level Advanced', topics: ['Academic reading', 'Presentation skills', 'Critical thinking'] },
        { week: '16-20', title: 'C1 Level Introduction', topics: ['Expert vocabulary', 'Research writing', 'Debate skills'] },
        { week: '21-25', title: 'C1 Level Mastery', topics: ['Native-like fluency', 'Professional communication', 'Advanced topics'] },
        { week: '26-30', title: 'Final Preparation', topics: ['Full mock tests', 'Exam strategies', 'Individual coaching'] }
      ],
      benefits: [
        'Lộ trình 30 tuần bài bản từ B1 lên C1',
        '500+ bài tập đa dạng với độ khó tăng dần',
        'Mock test hàng tuần với chấm chữa chi tiết',
        'Mentoring 1-1 với giảng viên giàu kinh nghiệm',
        'Học liệu độc quyền theo tiêu chuẩn quốc tế',
        'Cam kết đầu ra hoặc hoàn tiền 100%'
      ],
      outcomes: [
        'Đạt trình độ C1 VSTEP tương đương IELTS 7.0+',
        'Thành thạo cả 4 kỹ năng trong môi trường học thuật',
        'Tự tin thi tuyển nghiên cứu sinh, du học',
        'Kỹ năng tự học và phát triển bền vững'
      ],
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      studentReviews: [
        { name: 'Hoàng Minh E', avatar: '👨‍🎓', rating: 5, date: '1 tuần trước', comment: 'Khóa Master 30 tuần đáng giá từng đồng! Từ B1 mình đã lên C1 với lộ trình rất khoa học. Giảng viên support tận tâm.' },
        { name: 'Vũ Thu F', avatar: '👩‍💼', rating: 5, date: '3 tuần trước', comment: 'Mock test hàng tuần giúp mình theo dõi tiến độ rất tốt. 500+ bài tập phong phú, không bao giờ nhàm chán!' },
        { name: 'Đặng Văn G', avatar: '👨', rating: 4, date: '2 tháng trước', comment: 'Chương trình dài hơi nhưng hiệu quả cao. Cam kết đầu ra rõ ràng, yên tâm học tập.' }
      ]
    },
    {
      id: 3,
      name: 'VSTEP Intensive',
      emoji: '🚀',
      badge: 'Intensive',
      badgeColor: 'bg-orange-100 text-orange-700',
      level: 'B2',
      duration: '8 tuần',
      lessons: 8,
      sessions: 8,
      price: '1,200,000đ',
      students: 945,
      rating: 4.6,
      reviews: 412,
      description: 'Khóa học cấp tốc giúp nâng cao kỹ năng nhanh chóng trong thời gian ngắn.',
      features: ['8 bài học tập trung', '300+ bài tập thực chiến', 'AI phản hồi chi tiết', 'Lộ trình cá nhân hóa'],
      color: 'from-orange-400 to-red-500',
      instructor: {
        name: 'Ths. Trần Văn Nam',
        title: 'Chuyên gia luyện thi cấp tốc',
        avatar: '👨‍💼'
      },
      curriculum: [
        { week: 1, title: 'Intensive Reading', topics: ['Speed reading B2', 'Question types', 'Time management'] },
        { week: 2, title: 'Intensive Listening', topics: ['Note-taking skills', 'Academic lectures', 'Conversations'] },
        { week: 3, title: 'Writing Task 1', topics: ['Email formats', 'Formal/Informal', 'Common topics'] },
        { week: 4, title: 'Writing Task 2', topics: ['Essay structures', 'Arguments', 'Examples'] },
        { week: 5, title: 'Speaking Part 1-2', topics: ['Self-intro', 'Topic talks', 'Fluency training'] },
        { week: 6, title: 'Speaking Part 3', topics: ['Discussions', 'Advanced vocabulary', 'Coherence'] },
        { week: 7, title: 'Mock Test & Review', topics: ['Full practice test', 'Weak points analysis', 'Improvement plan'] },
        { week: 8, title: 'Final Sprint', topics: ['Last strategies', 'Confidence building', 'Final test'] }
      ],
      benefits: [
        'Khóa học cấp tốc 8 tuần đạt B2 VSTEP',
        '300+ bài tập thực chiến theo đúng format thi',
        'AI phản hồi tức thì cho từng bài làm',
        'Lộ trình cá nhân hóa dựa trên điểm yếu',
        'Học liệu tập trung vào điểm thi quan trọng',
        'Hỗ trợ nhanh qua Telegram group'
      ],
      outcomes: [
        'Đạt B2 VSTEP trong 8 tuần',
        'Nắm chắc kỹ thuật làm bài hiệu quả',
        'Quản lý thời gian thi tốt',
        'Tự tin bước vào phòng thi'
      ],
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      studentReviews: [
        { name: 'Bùi Thị H', avatar: '👩', rating: 5, date: '5 ngày trước', comment: 'Cấp tốc mà chất lượng! 8 tuần mình đã pass B2. AI feedback nhanh giúp cải thiện điểm yếu ngay lập tức.' },
        { name: 'Ngô Minh I', avatar: '👨‍💼', rating: 4, date: '2 tuần trước', comment: 'Phù hợp cho người bận rộn như mình. Bài học cô đọng, tập trung vào trọng tâm. Rất recommend!' }
      ]
    },
    {
      id: 4,
      name: 'VSTEP Business',
      emoji: '💼',
      badge: 'Business',
      badgeColor: 'bg-blue-100 text-blue-700',
      level: 'B1-B2',
      duration: '16 tuần',
      lessons: 16,
      sessions: 16,
      price: '2,500,000đ',
      students: 1123,
      rating: 4.8,
      reviews: 523,
      description: 'Tiếng Anh thương mại chuyên nghiệp cho môi trường công sở quốc tế.',
      features: ['16 bài học Business', 'Email & Presentation', 'Meeting skills', 'Chứng chỉ doanh nghiệp'],
      color: 'from-blue-600 to-cyan-700',
      instructor: {
        name: 'MBA. Phạm Quốc Việt',
        title: 'Chuyên gia Tiếng Anh Thương mại',
        avatar: '👨‍💼'
      },
      curriculum: [
        { week: '1-4', title: 'Business Communication', topics: ['Professional emails', 'Phone calls', 'Business etiquette'] },
        { week: '5-8', title: 'Meetings & Presentations', topics: ['Leading meetings', 'Presenting data', 'Persuasion skills'] },
        { week: '9-12', title: 'Negotiations & Reports', topics: ['Negotiation tactics', 'Business reports', 'Proposals'] },
        { week: '13-16', title: 'Corporate English', topics: ['Industry vocabulary', 'International business', 'Certificate exam'] }
      ],
      benefits: [
        'Tiếng Anh thương mại chuyên nghiệp cho công sở',
        'Kỹ năng email, presentation, meeting thực tế',
        'Từ vựng chuyên ngành theo lĩnh vực',
        'Chứng chỉ có giá trị với doanh nghiệp',
        'Networking với cộng đồng chuyên gia',
        'Case studies từ các công ty Fortune 500'
      ],
      outcomes: [
        'Giao tiếp tự tin trong môi trường quốc tế',
        'Viết email và báo cáo chuyên nghiệp',
        'Thuyết trình và đàm phán hiệu quả',
        'Thăng tiến trong sự nghiệp'
      ],
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      studentReviews: [
        { name: 'Trương Văn J', avatar: '👨‍💼', rating: 5, date: '1 tuần trước', comment: 'Khóa Business rất thực tế! Email, meeting, presentation đều được luyện kỹ. Sau khóa mình tự tin giao tiếp với đối tác nước ngoài.' },
        { name: 'Lý Thu K', avatar: '👩‍💼', rating: 5, date: '2 tuần trước', comment: 'Case studies từ Fortune 500 rất bổ ích. Networking với các chuyên gia cũng là điểm cộng lớn!' }
      ]
    },
    {
      id: 5,
      name: 'VSTEP Academic',
      emoji: '🎓',
      badge: 'Academic',
      badgeColor: 'bg-indigo-100 text-indigo-700',
      level: 'B2-C1',
      duration: '18 tuần',
      lessons: 18,
      sessions: 18,
      price: '2,200,000đ',
      students: 789,
      rating: 4.5,
      reviews: 367,
      description: 'Tiếng Anh học thuật cho nghiên cứu sinh và giảng viên đại học.',
      features: ['18 bài học Academic', 'Research writing', 'Academic vocabulary', 'Presentation skills'],
      color: 'from-blue-500 to-cyan-600',
      instructor: {
        name: 'PGS.TS. Vũ Thị Lan',
        title: 'Phó Giáo sư Ngôn ngữ học',
        avatar: '👩‍🎓'
      },
      curriculum: [
        { week: '1-3', title: 'Academic Reading', topics: ['Research papers', 'Critical reading', 'Literature review'] },
        { week: '4-6', title: 'Academic Writing', topics: ['Essay structures', 'Citations', 'Thesis writing'] },
        { week: '7-9', title: 'Academic Listening', topics: ['Lectures', 'Seminars', 'Note-taking'] },
        { week: '10-12', title: 'Academic Speaking', topics: ['Presentations', 'Conferences', 'Discussions'] },
        { week: '13-15', title: 'Research Skills', topics: ['Methodology', 'Data analysis', 'Research proposals'] },
        { week: '16-18', title: 'Advanced Topics', topics: ['Publishing', 'Peer review', 'Academic career'] }
      ],
      benefits: [
        'Tiếng Anh học thuật chuẩn quốc tế',
        'Kỹ năng viết bài nghiên cứu và luận văn',
        'Thuyết trình tại hội thảo khoa học',
        'Từ vựng chuyên ngành học thuật phong phú',
        'Hỗ trợ publish bài báo quốc tế',
        'Mạng lưới nghiên cứu sinh toàn quốc'
      ],
      outcomes: [
        'Viết và publish bài nghiên cứu tiếng Anh',
        'Thuyết trình tự tin tại hội nghị quốc tế',
        'Đọc hiểu tài liệu học thuật chuyên sâu',
        'Sẵn sàng cho chương trình PhD'
      ],
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      studentReviews: [
        { name: 'PhD. Cao Minh L', avatar: '👨‍🎓', rating: 5, date: '3 tuần trước', comment: 'Khóa Academic cực kỳ chuyên sâu! Giúp mình publish được 2 bài báo quốc tế. PGS.TS Lan hỗ trợ rất tận tình.' },
        { name: 'NCS. Phương M', avatar: '👩‍🎓', rating: 5, date: '1 tháng trước', comment: 'Research writing skills được cải thiện đáng kể. Mạng lưới nghiên cứu sinh rất hữu ích cho công việc!' }
      ]
    },
    {
      id: 6,
      name: 'VSTEP Sprint',
      emoji: '⚡',
      badge: 'Sprint',
      badgeColor: 'bg-orange-100 text-orange-700',
      level: 'A2-B1',
      duration: '6 tuần',
      lessons: 6,
      sessions: 6,
      price: '800,000đ',
      students: 1456,
      rating: 4.7,
      reviews: 678,
      description: 'Khóa học siêu tốc cho người bận rộn, học nhanh - hiệu quả cao.',
      features: ['6 bài học cô đọng', '150+ bài tập cốt lõi', 'Quick review sessions', 'Mobile learning'],
      color: 'from-orange-500 to-red-600',
      instructor: {
        name: 'Thầy Alex Nguyễn',
        title: 'Chuyên gia luyện thi nhanh',
        avatar: '⚡'
      },
      curriculum: [
        { week: 1, title: 'Quick Start', topics: ['Essential grammar', 'Core vocabulary', 'Basic listening'] },
        { week: 2, title: 'Reading Speed', topics: ['Skimming techniques', 'Key words', 'Time hacks'] },
        { week: 3, title: 'Writing Essentials', topics: ['Email templates', 'Essay formulas', 'Quick practice'] },
        { week: 4, title: 'Speaking Shortcuts', topics: ['Answer patterns', 'Useful phrases', 'Confidence tricks'] },
        { week: 5, title: 'Power Practice', topics: ['Mini tests', 'Weak areas', 'Speed drills'] },
        { week: 6, title: 'Final Push', topics: ['Exam strategies', 'Last tips', 'Mock exam'] }
      ],
      benefits: [
        'Học siêu nhanh chỉ 6 tuần cho người bận rộn',
        '150+ bài tập cốt lõi tập trung điểm quan trọng',
        'Mobile learning - học mọi lúc mọi nơi',
        'Quick review sessions mỗi ngày 15 phút',
        'Công thức và mẹo thi nhanh hiệu quả',
        'Hỗ trợ 24/7 qua app mobile'
      ],
      outcomes: [
        'Hoàn thành khóa học trong 6 tuần',
        'Nắm vững kiến thức cốt lõi A2-B1',
        'Tiết kiệm thời gian tối đa',
        'Đạt kết quả nhanh với effort tối thiểu'
      ],
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      studentReviews: [
        { name: 'Đỗ Văn N', avatar: '👨', rating: 5, date: '4 ngày trước', comment: 'Sprint đúng nghĩa! Mình bận công việc nhưng vẫn học được nhờ mobile learning. 15 phút/ngày mà hiệu quả cao!' },
        { name: 'Hồ Thị O', avatar: '👩', rating: 4, date: '1 tuần trước', comment: 'Giá rẻ mà chất lượng tốt. Quick review sessions rất tiện, học được ở mọi nơi. Recommend cho người bận!' }
      ]
    },
    {
      id: 7,
      name: 'VSTEP Excellence',
      emoji: '⭐',
      badge: 'Excellence',
      badgeColor: 'bg-green-100 text-green-700',
      level: 'B2-C1',
      duration: '25 tuần',
      lessons: 25,
      sessions: 25,
      price: '2,800,000đ',
      students: 567,
      rating: 4.9,
      reviews: 234,
      description: 'Chương trình xuất sắc cho những ai muốn đạt điểm cao nhất.',
      features: ['25 bài học cao cấp', '600+ bài tập nâng cao', 'VIP mentoring', 'Exam strategies'],
      color: 'from-green-500 to-emerald-600',
      instructor: {
        name: 'TS. Hoàng Minh Châu',
        title: 'Chuyên gia VSTEP điểm cao',
        avatar: '⭐'
      },
      curriculum: [
        { week: '1-5', title: 'Excellence Foundation', topics: ['Advanced grammar mastery', 'Rich vocabulary', 'Academic skills'] },
        { week: '6-10', title: 'Reading Excellence', topics: ['Critical analysis', 'Speed + accuracy', 'Complex texts'] },
        { week: '11-15', title: 'Writing Excellence', topics: ['Advanced essays', 'Perfect structure', 'Native-like writing'] },
        { week: '16-20', title: 'Listening Excellence', topics: ['Accent training', 'Complex lectures', '100% accuracy'] },
        { week: '21-25', title: 'Speaking Excellence', topics: ['Fluency mastery', 'Perfect pronunciation', 'Final excellence'] }
      ],
      benefits: [
        'Chương trình VIP cho điểm số xuất sắc',
        '600+ bài tập nâng cao độ khó cao',
        'VIP mentoring 1-1 với chuyên gia hàng đầu',
        'Exam strategies bí quyết điểm cao',
        'Tài liệu độc quyền từ Cambridge & Oxford',
        'Cam kết đạt C1 hoặc hoàn tiền 100%'
      ],
      outcomes: [
        'Đạt điểm C1 VSTEP xuất sắc',
        'Thành thạo 4 kỹ năng ở trình độ cao nhất',
        'Tự tin thi bất kỳ kỳ thi nào',
        'Sẵn sàng cho môi trường quốc tế'
      ],
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      studentReviews: [
        { name: 'Phan Minh P', avatar: '👨‍💼', rating: 5, date: '2 tuần trước', comment: 'Excellence xứng tầm! VIP mentoring 1-1 giúp mình đạt C1 với điểm cao. Tài liệu Cambridge & Oxford rất chất lượng.' },
        { name: 'Võ Thu Q', avatar: '👩', rating: 5, date: '3 tuần trước', comment: 'Đạt C1 sau 25 tuần! Cam kết hoàn tiền làm mình yên tâm học tập. 600+ bài tập nâng cao rất bổ ích.' }
      ]
    },
    {
      id: 8,
      name: 'VSTEP Pro',
      emoji: '🔥',
      badge: 'Professional',
      badgeColor: 'bg-red-100 text-red-700',
      level: 'B1-C1',
      duration: '22 tuần',
      lessons: 22,
      sessions: 22,
      price: '2,600,000đ',
      students: 892,
      rating: 4.8,
      reviews: 445,
      description: 'Khóa học chuyên nghiệp cho người đi làm và chuyên gia.',
      features: ['22 bài học Professional', 'Real-world scenarios', 'Industry vocabulary', 'Career coaching'],
      color: 'from-orange-400 to-red-500',
      instructor: {
        name: 'MBA. David Trần',
        title: 'Chuyên gia đào tạo doanh nghiệp',
        avatar: '🔥'
      },
      curriculum: [
        { week: '1-6', title: 'Professional English', topics: ['Corporate communication', 'Business vocabulary', 'Professional writing'] },
        { week: '7-12', title: 'Industry Applications', topics: ['Real-world scenarios', 'Industry terms', 'Case studies'] },
        { week: '13-18', title: 'Career Skills', topics: ['Interview prep', 'Networking', 'Leadership communication'] },
        { week: '19-22', title: 'Expert Level', topics: ['Executive communication', 'Global business', 'Professional certification'] }
      ],
      benefits: [
        'Tiếng Anh chuyên nghiệp cho người đi làm',
        'Real-world scenarios từ các công ty lớn',
        'Industry vocabulary theo từng lĩnh vực',
        'Career coaching hỗ trợ thăng tiến',
        'Networking với chuyên gia đa ngành',
        'Chứng chỉ Professional có giá trị cao'
      ],
      outcomes: [
        'Giao tiếp chuyên nghiệp trong môi trường quốc tế',
        'Thăng tiến nhanh trong sự nghiệp',
        'Mở rộng cơ hội việc làm toàn cầu',
        'Tự tin làm việc với đối tác nước ngoài'
      ],
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      studentReviews: [
        { name: 'Đinh Văn R', avatar: '👨‍💼', rating: 5, date: '1 tuần trước', comment: 'VSTEP Pro thực sự professional! Real-world scenarios giúp mình apply trực tiếp vào công việc. Career coaching là điểm cộng!' },
        { name: 'Lương Thị S', avatar: '👩‍💼', rating: 5, date: '2 tuần trước', comment: 'Sau khóa học mình được promote làm manager. Networking với chuyên gia đa ngành rất giá trị!' }
      ]
    },
    {
      id: 9,
      name: 'VSTEP Premium',
      emoji: '💎',
      badge: 'Premium',
      badgeColor: 'bg-cyan-100 text-cyan-700',
      level: 'B2-C1',
      duration: '24 tuần',
      lessons: 24,
      sessions: 24,
      price: '3,000,000đ',
      students: 345,
      rating: 4.9,
      reviews: 178,
      description: 'Gói cao cấp với đầy đủ tính năng và hỗ trợ 24/7.',
      features: ['24 bài học Premium', 'VIP support 24/7', 'Unlimited practice', 'Personal tutor'],
      color: 'from-cyan-600 to-blue-700',
      instructor: {
        name: 'TS. Sarah Johnson',
        title: 'Native Expert & VSTEP Examiner',
        avatar: '💎'
      },
      curriculum: [
        { week: '1-6', title: 'Premium Foundation', topics: ['Advanced B2 skills', 'Expert vocabulary', 'Premium materials'] },
        { week: '7-12', title: 'Premium Reading & Listening', topics: ['Complex texts', 'Native accents', 'Perfect scores'] },
        { week: '13-18', title: 'Premium Writing & Speaking', topics: ['Native-like writing', 'Fluent speaking', 'Expert feedback'] },
        { week: '19-24', title: 'Premium Mastery', topics: ['C1 excellence', 'Mock exams', 'VIP certification'] }
      ],
      benefits: [
        'Gói cao cấp với VIP support 24/7',
        'Unlimited practice không giới hạn',
        'Personal tutor native speaker riêng',
        'Tài liệu Premium từ các trường top thế giới',
        'Học nhóm nhỏ VIP max 3 người',
        'Đảm bảo đầu ra C1 hoặc học lại miễn phí'
      ],
      outcomes: [
        'Đạt C1 VSTEP với điểm số cao',
        'Tiếng Anh native-like fluency',
        'Tự tin trong mọi tình huống',
        'Sẵn sàng cho career quốc tế'
      ],
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      studentReviews: [
        { name: 'Nguyễn Thị T', avatar: '👩', rating: 5, date: '5 ngày trước', comment: 'Premium đắt nhưng xứng đáng! Personal tutor native speaker Sarah rất tận tâm. VIP support 24/7 response cực nhanh!' },
        { name: 'Trịnh Văn U', avatar: '👨', rating: 5, date: '1 tuần trước', comment: 'Unlimited practice giúp mình luyện không giới hạn. Học nhóm VIP 3 người rất hiệu quả, tương tác nhiều!' }
      ]
    },
    {
      id: 10,
      name: 'VSTEP Foundation',
      emoji: '📚',
      badge: 'Foundation',
      badgeColor: 'bg-teal-100 text-teal-700',
      level: 'A2-B1',
      duration: '12 tuần',
      lessons: 12,
      sessions: 12,
      price: '1,000,000đ',
      students: 1234,
      rating: 4.8,
      reviews: 456,
      description: 'Xây dựng nền tảng vững chắc cho người mới bắt đầu.',
      features: ['12 bài học Foundation', 'Grammar basics', 'Essential vocabulary', 'Speaking practice'],
      color: 'from-teal-500 to-green-600',
      instructor: {
        name: 'Cô Mai Linh',
        title: 'Chuyên gia đào tạo nền tảng',
        avatar: '📚'
      },
      curriculum: [
        { week: 1, title: 'English Basics', topics: ['Basic grammar', 'Common phrases', 'Pronunciation'] },
        { week: 2, title: 'Listening Foundation', topics: ['Simple conversations', 'Daily topics', 'Basic note-taking'] },
        { week: 3, title: 'Reading Foundation', topics: ['Simple texts', 'Key words', 'Understanding main ideas'] },
        { week: 4, title: 'Writing Basics', topics: ['Simple sentences', 'Email basics', 'Short paragraphs'] },
        { week: 5, title: 'Speaking Basics', topics: ['Self-introduction', 'Daily conversations', 'Basic fluency'] },
        { week: '6-8', title: 'A2 Level Practice', topics: ['A2 grammar', 'A2 vocabulary', 'A2 tests'] },
        { week: '9-12', title: 'B1 Introduction', topics: ['B1 skills', 'Intermediate practice', 'Final assessment'] }
      ],
      benefits: [
        'Xây dựng nền tảng vững chắc từ con số 0',
        'Học từ cơ bản đến intermediate',
        'Grammar basics được giải thích dễ hiểu',
        'Essential vocabulary cho giao tiếp hàng ngày',
        'Speaking practice với giáo viên nhiệt tình',
        'Lộ trình rõ ràng từ A2 lên B1'
      ],
      outcomes: [
        'Nắm vững kiến thức nền tảng tiếng Anh',
        'Đạt A2-B1 VSTEP với tự tin',
        'Giao tiếp được trong các tình huống cơ bản',
        'Sẵn sàng cho các khóa học nâng cao'
      ],
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      studentReviews: [
        { name: 'Đào Thị V', avatar: '👩', rating: 5, date: '3 ngày trước', comment: 'Foundation tuyệt vời cho người mới! Cô Mai Linh giải thích dễ hiểu, từ con số 0 mình đã lên A2. Grammar basics rất rõ ràng!' },
        { name: 'Bùi Văn W', avatar: '👨', rating: 5, date: '1 tuần trước', comment: 'Xây nền móng vững chắc! Lộ trình từ A2 lên B1 rất khoa học. Giá cả phải chăng, phù hợp học sinh sinh viên!' }
      ]
    }
  ];

  // AI Features
  const aiFeatures = [
    {
      icon: PenTool,
      name: 'AI Chấm điểm Writing',
      description: 'Chấm bài viết tự động trong 5 giây với độ chính xác 98%. Phân tích chi tiết về Task Response, Coherence, Vocabulary và Grammar.',
      features: ['Chấm điểm CEFR tức thì', 'Phản hồi chi tiết từng tiêu chí', 'Gợi ý cải thiện cụ thể', 'So sánh với bài mẫu']
    },
    {
      icon: Mic,
      name: 'AI Chấm Speaking',
      description: 'Đánh giá khả năng nói với AI voice recognition, phân tích phát âm, ngữ điệu, từ vựng và độ lưu loát.',
      features: ['Nhận diện giọng nói chính xác', 'Phân tích phát âm từng âm', 'Đánh giá độ trôi chảy', 'Feedback cải thiện']
    },
    {
      icon: Volume2,
      name: 'AI Phân tích phát âm',
      description: 'Công nghệ speech-to-text tiên tiến phân tích từng âm tiết, nhận diện lỗi phát âm và hướng dẫn sửa chữa.',
      features: ['Phân tích IPA phonetics', 'So sánh với native speaker', 'Luyện tập từng âm khó', 'Theo dõi tiến bộ']
    },
    {
      icon: Target,
      name: 'AI Lộ trình cá nhân hóa',
      description: 'AI phân tích điểm mạnh, điểm yếu và tạo lộ trình học tập riêng biệt phù hợp với mục tiêu của bạn.',
      features: ['Đánh giá năng lực đầu vào', 'Lộ trình học tập tối ưu', 'Điều chỉnh theo tiến độ', 'Dự đoán thời gian đạt mục tiêu']
    },
    {
      icon: FileText,
      name: 'AI Mock Test Tạo Đề',
      description: 'Tạo đề thi thử không giới hạn với độ khó tương đương đề thi thật, đảm bảo không trùng lặp.',
      features: ['Tạo đề tự động theo chuẩn VSTEP', 'Độ khó điều chỉnh được', 'Đề không trùng lặp', 'Bank 10,000+ câu hỏi']
    },
    {
      icon: BarChart,
      name: 'Dashboard phân tích điểm',
      description: 'Bảng điều khiển thống kê toàn diện với biểu đồ trực quan, theo dõi tiến độ học tập chi tiết.',
      features: ['Biểu đồ tiến độ theo thời gian', 'So sánh 4 kỹ năng', 'Xác định điểm yếu', 'Báo cáo hàng tuần']
    },
    {
      icon: Award,
      name: 'Dự đoán điểm chuẩn CEFR',
      description: 'AI dự đoán chính xác band điểm CEFR bạn có thể đạt được dựa trên kết quả luyện tập.',
      features: ['Dự đoán điểm với độ chính xác 95%', 'Đánh giá theo từng kỹ năng', 'Timeline đạt mục tiêu', 'Tư vấn cải thiện']
    },
    {
      icon: MessageSquare,
      name: 'Trợ lý học tập AI Chat',
      description: 'Chatbot AI thông minh trả lời mọi câu hỏi về ngữ pháp, từ vựng, chiến lược làm bài 24/7.',
      features: ['Trả lời tức thì 24/7', 'Giải thích ngữ pháp dễ hiểu', 'Gợi ý từ vựng theo ngữ cảnh', 'Practice conversation']
    }
  ];

  // Student testimonials
  const testimonials = [
    {
      name: 'Nguyễn Minh Anh',
      avatar: '👩‍🎓',
      achievement: 'Đạt C1 - 8.5/10',
      school: 'ĐH Quốc Gia Hà Nội',
      review: 'VSTEPRO đã giúp mình từ B1 lên C1 chỉ trong 4 tháng! AI chấm bài writing cực kỳ chi tiết, giúp mình cải thiện rõ rệt. Lộ trình học cá nhân hóa rất phù hợp với thời gian của mình.',
      rating: 5,
      date: '15/11/2024'
    },
    {
      name: 'Trần Quốc Việt',
      avatar: '👨‍💼',
      achievement: 'Đạt B2 - 7.0/10',
      school: 'ĐH Bách Khoa HCM',
      review: 'Tính năng AI Speaking phân tích phát âm siêu chi tiết. Mình đã sửa được nhiều lỗi phát âm mà trước giờ không biết. Dashboard thống kê giúp mình thấy rõ tiến bộ từng ngày.',
      rating: 5,
      date: '08/11/2024'
    },
    {
      name: 'Lê Thị Hương',
      avatar: '👩‍🏫',
      achievement: 'Đạt B2 - 7.5/10',
      school: 'Giảng viên ĐH Ngoại Ngữ',
      review: 'Với tư cách giảng viên, tôi đánh giá cao chất lượng nội dung và phương pháp giảng dạy của VSTEPRO. Hệ thống bài tập đa dạng, đúng chuẩn VSTEP. AI chấm bài chính xác như giáo viên.',
      rating: 5,
      date: '01/11/2024'
    },
    {
      name: 'Phạm Đức Thắng',
      avatar: '👨‍🎓',
      achievement: 'Đạt B1 - 6.0/10',
      school: 'ĐH Kinh Tế Quốc Dân',
      review: 'Ban đầu mình lo lắng về khả năng nghe và nói. Nhưng sau 2 tháng học với VSTEPRO, mình đã tự tin hơn rất nhiều. Mock tests giống đề thật giúp mình không bị bất ngờ trong kỳ thi.',
      rating: 5,
      date: '25/10/2024'
    },
    {
      name: 'Vũ Thu Trang',
      avatar: '👩‍💻',
      achievement: 'Đạt C1 - 8.0/10',
      school: 'Software Engineer',
      review: 'Học VSTEPRO rất linh hoạt, mình có thể học bất cứ lúc nào. AI Mock Test tạo đề mới mỗi lần, giúp mình luyện tập không giới hạn. Đội ngũ support nhiệt tình, giải đáp nhanh.',
      rating: 5,
      date: '18/10/2024'
    },
    {
      name: 'Hoàng Minh Tuấn',
      avatar: '👨‍🔬',
      achievement: 'Đạt B2 - 7.2/10',
      school: 'Nghiên cứu sinh ĐH Y',
      review: 'Tài liệu học thuật của VSTEPRO rất phong phú. Academic writing templates giúp mình viết bài luận khoa học tốt hơn. AI chatbot trả lời mọi thắc mắc về ngữ pháp cực nhanh.',
      rating: 5,
      date: '10/10/2024'
    }
  ];

  // Teachers
  const teachers = [
    {
      name: 'TS. Nguyễn Văn Nam',
      title: 'Trưởng nhóm Giảng viên - Chuyên gia VSTEP',
      avatar: '👨‍🏫',
      credentials: ['PhD in Applied Linguistics', 'IELTS 8.5', '15 năm kinh nghiệm'],
      specialty: 'Academic Writing & Reading',
      description: 'Chuyên gia đào tạo VSTEP với hơn 15 năm kinh nghiệm. Đã giúp hơn 5,000 học viên đạt mục tiêu từ B1 đến C1.',
      achievements: '5,000+ học viên thành công'
    },
    {
      name: 'ThS. Trần Thị Lan',
      title: 'Giảng viên Listening & Speaking',
      avatar: '👩‍🏫',
      credentials: ['MA in TESOL', 'Cambridge CELTA', '10 năm kinh nghiệm'],
      specialty: 'Listening & Speaking Skills',
      description: 'Chuyên gia phát âm và giao tiếp tiếng Anh. Giảng viên cấp cao tại trường Đại học Ngoại Ngữ - ĐHQGHN.',
      achievements: '3,500+ học viên cải thiện Speaking'
    },
    {
      name: 'Mr. David Johnson',
      title: 'Native Speaker - Pronunciation Coach',
      avatar: '👨‍💼',
      credentials: ['BA in English Literature', 'TEFL Certified', '12 năm dạy tại VN'],
      specialty: 'Pronunciation & Fluency',
      description: 'Giáo viên người Mỹ với 12 năm kinh nghiệm giảng dạy tại Việt Nam. Chuyên về phát âm chuẩn và giao tiếp tự nhiên.',
      achievements: '4,000+ học viên cải thiện phát âm'
    },
    {
      name: 'ThS. Phạm Quốc Tuấn',
      title: 'Giảng viên Grammar & Vocabulary',
      avatar: '👨‍💻',
      credentials: ['MA in English Education', 'IELTS 8.0', '8 năm kinh nghiệm'],
      specialty: 'Grammar & Vocabulary Building',
      description: 'Chuyên gia ngữ pháp với phương pháp giảng dạy độc đáo, dễ hiểu. Tác giả nhiều giáo trình luyện thi VSTEP.',
      achievements: 'Tác giả 5 giáo trình VSTEP'
    },
    {
      name: 'Ms. Sarah Williams',
      title: 'Academic Writing Specialist',
      avatar: '👩‍💼',
      credentials: ['MA in Academic Writing', 'Cambridge CPE', '10 năm kinh nghiệm'],
      specialty: 'Academic Writing & Essay',
      description: 'Chuyên gia viết luận học thuật từ Anh Quốc. Đã review và chấm hơn 10,000 bài luận VSTEP.',
      achievements: '10,000+ bài viết đã chấm'
    },
    {
      name: 'ThS. Lê Minh Hà',
      title: 'AI Technology & Methodology Expert',
      avatar: '👩‍🔬',
      credentials: ['MA in EdTech', 'AI Certified', '7 năm nghiên cứu'],
      specialty: 'AI Learning & Methodology',
      description: 'Chuyên gia công nghệ giáo dục và AI trong học tập. Phát triển hệ thống AI chấm điểm của VSTEPRO.',
      achievements: 'Phát triển AI Engine VSTEPRO'
    }
  ];

  // Partners
  const partners = [
    {
      name: 'Đại học Quốc Gia Hà Nội',
      logo: '🏛️',
      type: 'Đối tác chiến lược',
      description: 'Hợp tác đào tạo và cung cấp giáo trình VSTEP chuẩn quốc tế cho sinh viên và giảng viên.',
      students: '5,000+ sinh viên'
    },
    {
      name: 'Đại học Bách Khoa TP.HCM',
      logo: '🎓',
      type: 'Đối tác đào tạo',
      description: 'Triển khai chương trình luyện thi VSTEP cho sinh viên các khoa kỹ thuật.',
      students: '3,500+ sinh viên'
    },
    {
      name: 'Đại học Ngoại Ngữ - ĐHQGHN',
      logo: '📚',
      type: 'Đối tác học thuật',
      description: 'Phát triển nội dung học thuật và đào tạo giảng viên chuẩn VSTEP.',
      students: '4,000+ sinh viên'
    },
    {
      name: 'Đại học Kinh Tế Quốc Dân',
      logo: '💼',
      type: 'Đối tác đào tạo',
      description: 'Cung cấp khóa học VSTEP Business English cho sinh viên và doanh nghiệp.',
      students: '2,800+ sinh viên'
    },
    {
      name: 'Trường THPT Chuyên Hà Nội - Amsterdam',
      logo: '🏫',
      type: 'Đối tác giáo dục',
      description: 'Chương trình luyện thi VSTEP cho học sinh THPT chuẩn bị thi đại học.',
      students: '1,500+ học sinh'
    },
    {
      name: 'Công ty FPT Software',
      logo: '💻',
      type: 'Đối tác doanh nghiệp',
      description: 'Đào tạo tiếng Anh chuyên ngành IT cho nhân viên và quản lý.',
      students: '2,000+ nhân viên'
    },
    {
      name: 'Tập đoàn Vingroup',
      logo: '🏢',
      type: 'Đối tác doanh nghiệp',
      description: 'Chương trình English for Business cho toàn hệ thống Vingroup.',
      students: '3,000+ nhân viên'
    },
    {
      name: 'British Council Vietnam',
      logo: '🇬🇧',
      type: 'Đối tác quốc tế',
      description: 'Hợp tác phát triển nội dung và chứng chỉ quốc tế.',
      students: 'International Standard'
    }
  ];

  // Events & Schedule
  const events = [
    {
      title: 'Khai giảng khóa VSTEP C1 - Kỳ 01/2025',
      date: '05/01/2025',
      time: '09:00 - 11:00',
      type: 'Khai giảng',
      location: 'Online + Offline (Hà Nội, HCM)',
      spots: '50 chỗ còn lại',
      color: 'from-blue-600 to-cyan-600'
    },
    {
      title: 'Workshop: Chiến lược làm bài Reading hiệu quả',
      date: '10/01/2025',
      time: '14:00 - 16:00',
      type: 'Workshop miễn phí',
      location: 'Online via Zoom',
      spots: 'Unlimited',
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Mock Test toàn quốc - Thi thử miễn phí',
      date: '15/01/2025',
      time: '08:00 - 12:00',
      type: 'Thi thử',
      location: '10 tỉnh thành',
      spots: '200 chỗ còn lại',
      color: 'from-orange-500 to-red-500'
    },
    {
      title: 'Khai giảng khóa VSTEP B2 - Kỳ 01/2025',
      date: '20/01/2025',
      time: '09:00 - 11:00',
      type: 'Khai giảng',
      location: 'Online + Offline',
      spots: '80 chỗ còn lại',
      color: 'from-blue-600 to-cyan-600'
    },
    {
      title: 'Webinar: AI trong học tiếng Anh - Tương lai giáo dục',
      date: '25/01/2025',
      time: '19:00 - 20:30',
      type: 'Webinar',
      location: 'Online',
      spots: 'Unlimited',
      color: 'from-indigo-500 to-blue-600'
    },
    {
      title: 'Speaking Club: Practice with Native Speakers',
      date: '30/01/2025',
      time: '18:00 - 20:00',
      type: 'Speaking Club',
      location: 'Online + Hà Nội',
      spots: '30 chỗ còn lại',
      color: 'from-teal-500 to-green-500'
    }
  ];

  // Blog posts
  const blogPosts = [
    {
      id: 1,
      title: '10 Bí quyết học từ vựng VSTEP hiệu quả trong 30 ngày',
      excerpt: 'Khám phá phương pháp học từ vựng khoa học giúp bạn ghi nhớ lâu hơn và áp dụng linh hoạt trong bài thi VSTEP.',
      image: '📚',
      author: 'TS. Nguyễn Văn Nam',
      authorAvatar: '👨‍🏫',
      date: '20/12/2024',
      readTime: '8 phút đọc',
      category: 'Vocabulary',
      categoryColor: 'bg-blue-100 text-blue-700',
      views: 2453,
      likes: 189
    },
    {
      id: 2,
      title: 'Chiến lược làm bài Reading VSTEP đạt 8.0+ chi tiết từng Part',
      excerpt: 'Hướng dẫn từng bước cách tiếp cận bài đọc VSTEP, quản lý thời gian và các kỹ thuật scan-skim hiệu quả.',
      image: '📖',
      author: 'ThS. Trần Thị Lan',
      authorAvatar: '👩‍🏫',
      date: '18/12/2024',
      readTime: '12 phút đọc',
      category: 'Reading',
      categoryColor: 'bg-green-100 text-green-700',
      views: 3521,
      likes: 267
    },
    {
      id: 3,
      title: 'Cách cải thiện phát âm tiếng Anh với AI trong 2 tuần',
      excerpt: 'Sử dụng công nghệ AI để phân tích và sửa lỗi phát âm, giúp bạn nói tiếng Anh tự nhiên và tự tin hơn.',
      image: '🎤',
      author: 'Mr. David Johnson',
      authorAvatar: '👨‍💼',
      date: '15/12/2024',
      readTime: '10 phút đọc',
      category: 'Speaking',
      categoryColor: 'bg-cyan-100 text-cyan-700',
      views: 4123,
      likes: 342
    },
    {
      id: 4,
      title: 'Writing Task 2: Bí quyết viết Introduction và Conclusion ấn tượng',
      excerpt: 'Template và ví dụ cụ thể giúp bạn viết mở bài và kết bài VSTEP Writing đạt điểm cao.',
      image: '✍️',
      author: 'Ms. Sarah Williams',
      authorAvatar: '👩‍💼',
      date: '12/12/2024',
      readTime: '15 phút đọc',
      category: 'Writing',
      categoryColor: 'bg-orange-100 text-orange-700',
      views: 2987,
      likes: 198
    },
    {
      id: 5,
      title: 'Lộ trình tự học VSTEP từ B1 lên C1 trong 6 tháng',
      excerpt: 'Kế hoạch học tập chi tiết từng tuần, từng tháng giúp bạn tự học VSTEP hiệu quả tại nhà.',
      image: '🎯',
      author: 'ThS. Phạm Quốc Tuấn',
      authorAvatar: '👨‍💻',
      date: '10/12/2024',
      readTime: '20 phút đọc',
      category: 'Study Plan',
      categoryColor: 'bg-orange-100 text-orange-700',
      views: 5678,
      likes: 456
    },
    {
      id: 6,
      title: 'Listening VSTEP: 5 loại Accent phổ biến và cách làm quen',
      excerpt: 'Phân tích các giọng Anh - Mỹ - Úc trong bài thi VSTEP và phương pháp luyện nghe hiệu quả.',
      image: '🎧',
      author: 'ThS. Lê Minh Hà',
      authorAvatar: '👩‍🔬',
      date: '08/12/2024',
      readTime: '11 phút đọc',
      category: 'Listening',
      categoryColor: 'bg-cyan-100 text-cyan-700',
      views: 3245,
      likes: 234
    }
  ];

  // Pricing plans
  const pricingPlans = [
    {
      name: 'Basic',
      price: '0đ',
      period: 'Miễn phí mãi mãi',
      description: 'Dùng thử các tính năng cơ bản',
      features: [
        'Thi thử miễn phí 2 lần/tháng',
        'Truy cập 100+ bài tập',
        'AI chấm Reading & Listening',
        'Xem kết quả cơ bản',
        'Tài liệu học miễn phí',
        'Cộng đồng học viên'
      ],
      cta: 'Dùng thử miễn phí',
      color: 'from-gray-400 to-gray-500',
      popular: false
    },
    {
      name: 'Premium',
      price: '299.000đ',
      period: '/tháng',
      description: 'Phù hợp cho học viên cá nhân',
      features: [
        'Tất cả tính năng Basic',
        'Thi thử không giới hạn',
        'AI chấm cả 4 kỹ năng',
        'Lộ trình học cá nhân hóa',
        'Dashboard phân tích chi tiết',
        'AI Mock Test tạo đề',
        'Trợ lý AI 24/7',
        'Hỗ trợ ưu tiên'
      ],
      cta: 'Đăng ký ngay',
      color: 'from-blue-600 to-cyan-600',
      popular: true
    },
    {
      name: 'Pro',
      price: '499.000đ',
      period: '/tháng',
      description: 'Cam kết đầu ra - Hoàn tiền 100%',
      features: [
        'Tất cả tính năng Premium',
        '1-1 Mentoring với giảng viên',
        'Chấm bài Writing thủ công',
        'Speaking practice với giáo viên',
        'Học nhóm nhỏ (max 5 người)',
        'Tài liệu độc quyền',
        'Cam kết đầu ra',
        'Hoàn tiền nếu không đạt'
      ],
      cta: 'Tư vấn 1-1',
      color: 'from-orange-500 to-red-500',
      popular: false
    },
    {
      name: 'Enterprise',
      price: 'Liên hệ',
      period: 'Tùy chỉnh',
      description: 'Giải pháp cho doanh nghiệp & trường học',
      features: [
        'Tất cả tính năng Pro',
        'Quản lý học viên tập trung',
        'Báo cáo chi tiết cho quản lý',
        'API integration',
        'White-label solution',
        'Đào tạo giảng viên',
        'Support 24/7',
        'Hợp đồng dài hạn'
      ],
      cta: 'Liên hệ tư vấn',
      color: 'from-cyan-600 to-blue-600',
      popular: false
    }
  ];

  // Show Free Plan Dashboard if logged in
  if (showFreePlanDashboard) {
    return (
      <FreePlanDashboard 
        onBack={() => setShowFreePlanDashboard(false)} 
        userEmail={loggedInEmail}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Premium Navigation Header */}
      <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
        {/* Top Bar - Support/Community/App/Language */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-900 border-b border-blue-900">
          <div className="max-w-[1360px] mx-auto px-6 py-2">
            <div className="flex items-center justify-between text-sm">
              {/* Left: System Announcements */}
              <div className="flex items-center gap-3 overflow-hidden flex-1">
                <span className="text-orange-300 text-lg animate-pulse flex-shrink-0">📢</span>
                <div className="overflow-hidden flex-1">
                  <div className="flex animate-marquee">
                    <span className="text-sm font-medium whitespace-nowrap pr-20 text-white">
                      🎉 Chào mừng đến với VSTEPRO! 
                      <span className="mx-4">•</span>
                      ✨ Tính năng mới: Chấm AI cho Writing & Speaking 
                      <span className="mx-4">•</span>
                      🎯 Cập nhật: 500+ đề thi mới đã được thêm vào ngân hàng đề
                      <span className="mx-4">•</span>
                      📚 Khóa học VSTEP B2 giảm 30% - Chỉ còn 3 ngày!
                    </span>
                    {/* Duplicate for seamless loop */}
                    <span className="text-sm font-medium whitespace-nowrap pr-20 text-white">
                      🎉 Chào mừng đến với VSTEPRO! 
                      <span className="mx-4">•</span>
                      ✨ Tính năng mới: Chấm AI cho Writing & Speaking 
                      <span className="mx-4">•</span>
                      🎯 Cập nhật: 500+ đề thi mới đã được thêm vào ngân hàng đề
                      <span className="mx-4">•</span>
                      📚 Khóa học VSTEP B2 giảm 30% - Chỉ còn 3 ngày!
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Right: Language Switcher */}
              <div className="flex items-center gap-3">
                <button className="px-3 py-1 rounded-md hover:bg-white/10 transition-colors text-white">
                  🇻🇳 Tiếng Việt
                </button>
                <button className="px-3 py-1 rounded-md hover:bg-white/10 transition-colors text-white">
                  🇺🇸 English
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="bg-white">
          <div className="w-full">
            <div className="flex items-center h-16 gap-1 px-4">
              {/* Logo */}
              <div className="flex items-center gap-2 shrink-0">
                <button 
                  onClick={onBack}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Quay lại"
                >
                  <X className="size-4 text-gray-600" />
                </button>
                <div className="flex items-center gap-1.5">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-sky-500 rounded-lg flex items-center justify-center">
                    <GraduationCap className="size-5 text-white" />
                  </div>
                  <div className="font-bold text-lg bg-gradient-to-r from-blue-700 to-sky-600 bg-clip-text text-transparent">
                    VSTEPRO
                  </div>
                </div>
              </div>

              {/* Navigation Menu */}
              <nav className="flex items-center flex-1 justify-between text-sm">
                {/* 1. Trang chủ */}
                <button
                  onClick={onBack}
                  className="px-3 py-1.5 rounded-lg text-gray-700 hover:bg-sky-50 hover:text-sky-600 transition-all whitespace-nowrap"
                >
                  Trang chủ
                </button>

                {/* 2. Khoá học - Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => toggleDropdown('courses')}
                    className="px-3 py-1.5 rounded-lg text-gray-700 hover:bg-sky-50 hover:text-sky-600 transition-all flex items-center gap-1 whitespace-nowrap"
                  >
                    Khóa học
                    <ChevronDown className={`size-3.5 transition-transform ${activeDropdown === 'courses' ? 'rotate-180' : ''}`} />
                  </button>
                  {activeDropdown === 'courses' && (
                    <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border p-4 animate-fadeIn">
                      <div className="text-xs text-gray-500 mb-3">10 KHOÁ HỌC ĐỒNG BỘ</div>
                      <div className="grid grid-cols-2 gap-2">
                        {courses.slice(0, 10).map((course) => (
                          <button 
                            key={course.id} 
                            onClick={() => navigateToSection('courses')}
                            className="text-left px-3 py-2 rounded-lg hover:bg-sky-50 text-sm text-gray-700 hover:text-sky-600 transition-colors"
                          >
                            {course.name.split(' - ')[0]}
                          </button>
                        ))}
                      </div>
                      <button 
                        onClick={() => navigateToSection('courses')}
                        className="w-full mt-3 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors text-sm"
                      >
                        Xem tất cả khóa học →
                      </button>
                    </div>
                  )}
                </div>

                {/* 3. Thi thử miễn phí - CTA Button */}
                <button 
                  onClick={() => setShowFreeTrialModal(true)}
                  className="px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 transition-all shadow-sm hover:shadow-md whitespace-nowrap text-xs"
                >
                  Thi thử miễn phí
                </button>

                {/* 4. AI Learning Hub - Dropdown Premium */}
                <div className="relative">
                  <button
                    onClick={() => toggleDropdown('ai-hub')}
                    className="px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-sky-50 to-blue-50 text-blue-700 hover:from-sky-100 hover:to-blue-100 transition-all flex items-center gap-1 whitespace-nowrap text-xs"
                  >
                    <Brain className="size-3.5" />
                    AI Learning Hub
                    <ChevronDown className={`size-3.5 transition-transform ${activeDropdown === 'ai-hub' ? 'rotate-180' : ''}`} />
                  </button>
                  {activeDropdown === 'ai-hub' && (
                    <div className="absolute top-full left-0 mt-2 w-72 bg-gradient-to-br from-sky-50 to-blue-50 rounded-xl shadow-2xl border border-sky-200 p-4 animate-fadeIn">
                      <div className="text-xs text-blue-700 mb-3 flex items-center gap-2">
                        <Sparkles className="size-4" />
                        PREMIUM AI FEATURES
                      </div>
                      <div className="space-y-1">
                        {aiFeatures.map((item, idx) => (
                          <button 
                            key={idx} 
                            onClick={() => navigateToSection('ai-hub')}
                            className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/80 text-sm text-gray-700 hover:text-sky-600 transition-colors flex items-center gap-2"
                          >
                            <item.icon className="size-4" />
                            {item.name}
                          </button>
                        ))}
                      </div>
                      <button 
                        onClick={() => navigateToSection('ai-hub')}
                        className="w-full mt-3 px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity text-sm"
                      >
                        Khám phá AI Hub →
                      </button>
                    </div>
                  )}
                </div>

                {/* 5. Học liệu & Tài nguyên - Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => toggleDropdown('resources')}
                    className="px-3 py-1.5 rounded-lg text-gray-700 hover:bg-sky-50 hover:text-sky-600 transition-all flex items-center gap-1 whitespace-nowrap"
                  >
                    Học liệu
                    <ChevronDown className={`size-3.5 transition-transform ${activeDropdown === 'resources' ? 'rotate-180' : ''}`} />
                  </button>
                  {activeDropdown === 'resources' && (
                    <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border p-4 animate-fadeIn">
                      <div className="space-y-1">
                        {[
                          { icon: FileText, name: 'Sample test - 500+ đề', count: '500+' },
                          { icon: Award, name: 'Band descriptor CEFR', count: 'A2-C1' },
                          { icon: BookOpen, name: 'Tài liệu kỹ năng', count: '200+' },
                          { icon: Headphones, name: 'Audio thư viện', count: '1000+' },
                          { icon: Video, name: 'Video hướng dẫn', count: '300+' },
                        ].map((item, idx) => (
                          <button 
                            key={idx}
                            onClick={() => navigateToSection('resources')}
                            className="w-full text-left px-3 py-2 rounded-lg hover:bg-sky-50 text-sm text-gray-700 hover:text-sky-600 transition-colors flex items-center justify-between"
                          >
                            <div className="flex items-center gap-2">
                              <item.icon className="size-4" />
                              {item.name}
                            </div>
                            <span className="text-xs text-gray-500">{item.count}</span>
                          </button>
                        ))}
                      </div>
                      <button 
                        onClick={() => navigateToSection('resources')}
                        className="w-full mt-3 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors text-sm"
                      >
                        Xem tất cả tài liệu →
                      </button>
                    </div>
                  )}
                </div>

                {/* 6. Blog */}
                <button 
                  onClick={() => {
                    setActiveDropdown(null);
                    if (onNavigateToBlog) {
                      onNavigateToBlog();
                    } else {
                      setTimeout(() => {
                        const element = document.getElementById('section-blog');
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      }, 100);
                    }
                  }}
                  className="px-3 py-1.5 rounded-lg text-gray-700 hover:bg-sky-50 hover:text-sky-600 transition-all whitespace-nowrap"
                >
                  Blog
                </button>

                {/* 7. Feedback & Thành tích - Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => toggleDropdown('feedback')}
                    className="px-3 py-1.5 rounded-lg text-gray-700 hover:bg-sky-50 hover:text-sky-600 transition-all flex items-center gap-1 whitespace-nowrap"
                  >
                    Thành tích
                    <ChevronDown className={`size-3.5 transition-transform ${activeDropdown === 'feedback' ? 'rotate-180' : ''}`} />
                  </button>
                  {activeDropdown === 'feedback' && (
                    <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border p-4 animate-fadeIn">
                      <div className="space-y-1">
                        {[
                          { icon: Star, name: 'Học viên đạt B1/B2/C1', count: '15,000+' },
                          { icon: Trophy, name: 'Câu chuyện thành công', count: '500+' },
                          { icon: Video, name: 'Review video', count: '200+' },
                          { icon: Award, name: 'Chứng chỉ đạt chuẩn', count: '12,000+' },
                        ].map((item, idx) => (
                          <button 
                            key={idx}
                            onClick={() => navigateToSection('feedback')}
                            className="w-full text-left px-3 py-2 rounded-lg hover:bg-sky-50 text-sm text-gray-700 hover:text-sky-600 transition-colors flex items-center justify-between"
                          >
                            <div className="flex items-center gap-2">
                              <item.icon className="size-4" />
                              {item.name}
                            </div>
                            <span className="text-xs text-gray-500">{item.count}</span>
                          </button>
                        ))}
                      </div>
                      <button 
                        onClick={() => navigateToSection('feedback')}
                        className="w-full mt-3 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors text-sm"
                      >
                        Xem tất cả thành tích →
                      </button>
                    </div>
                  )}
                </div>

                {/* 8. Giảng viên */}
                <button 
                  onClick={() => navigateToSection('teachers')}
                  className="px-3 py-1.5 rounded-lg text-gray-700 hover:bg-sky-50 hover:text-sky-600 transition-all whitespace-nowrap"
                >
                  Giảng viên
                </button>

                {/* 9. Đối tác */}
                <button 
                  onClick={() => navigateToSection('partners')}
                  className="px-3 py-1.5 rounded-lg text-gray-700 hover:bg-sky-50 hover:text-sky-600 transition-all whitespace-nowrap"
                >
                  Đối tác
                </button>

                {/* 10. Sự kiện */}
                <button 
                  onClick={() => navigateToSection('events')}
                  className="px-3 py-1.5 rounded-lg text-gray-700 hover:bg-sky-50 hover:text-sky-600 transition-all whitespace-nowrap"
                >
                  Sự kiện
                </button>

                {/* 11. Giá */}
                <button 
                  onClick={() => navigateToSection('pricing')}
                  className="px-3 py-1.5 rounded-lg text-gray-700 hover:bg-sky-50 hover:text-sky-600 transition-all whitespace-nowrap"
                >
                  Giá
                </button>
              </nav>

              {/* Auth Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button 
                  onClick={() => onNavigateToAuth?.('login')}
                  className="px-4 py-1.5 rounded-lg border border-sky-600 text-sky-600 hover:bg-sky-50 transition-all text-sm whitespace-nowrap"
                >
                  Đăng nhập
                </button>
                <button 
                  onClick={() => onNavigateToAuth?.('register')}
                  className="px-4 py-1.5 rounded-lg bg-sky-500 text-white hover:bg-sky-600 transition-all shadow-sm hover:shadow-md text-sm whitespace-nowrap"
                >
                  Đăng ký
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-700 text-white py-24 overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-orange-300 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-300 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-300 rounded-full blur-3xl"></div>
        </div>
        
        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}></div>

        <div className="max-w-[1360px] mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full text-sm mb-8 shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all">
                <Zap className="size-4" />
                <span className="font-medium">🚀 Nền tảng luyện thi VSTEP #1 Việt Nam</span>
              </div>
              <h1 className="text-6xl mb-8 leading-tight">
                Chinh phục VSTEP với <br />
                <span className="bg-gradient-to-r from-orange-400 via-orange-300 to-yellow-400 bg-clip-text text-transparent font-bold">Công nghệ AI</span> tiên tiến
              </h1>
              <p className="text-xl text-white/90 mb-10 leading-relaxed">
                Hệ thống luyện thi VSTEP đầu tiên tích hợp AI chấm điểm tự động cho cả 4 kỹ năng. 
                Phân tích chi tiết, lộ trình cá nhân hóa, đạt mục tiêu nhanh chóng.
              </p>
              <div className="flex items-center gap-4 mb-12">
                <button 
                  onClick={() => navigateToSection('free-tests')}
                  className="group px-8 py-4 bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 text-white rounded-xl hover:shadow-2xl hover:shadow-orange-500/50 transition-all transform hover:scale-105 flex items-center gap-2 font-medium"
                >
                  <Trophy className="size-5 group-hover:rotate-12 transition-transform" />
                  Thi thử miễn phí ngay
                  <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={() => navigateToSection('ai-hub')}
                  className="px-8 py-4 bg-white/10 backdrop-blur-md text-white rounded-xl hover:bg-white/20 transition-all border-2 border-white/30 hover:border-white/50 font-medium"
                >
                  Dùng thử AI miễn phí
                </button>
              </div>
              <div className="flex items-center gap-12 pt-8 border-t-2 border-white/20">
                <div className="text-center group">
                  <div className="text-4xl mb-2 flex items-center justify-center gap-2 group-hover:scale-110 transition-transform">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                      <Users className="size-6" />
                    </div>
                    <span className="font-bold">50K+</span>
                  </div>
                  <div className="text-white/80">Học viên tin dùng</div>
                </div>
                <div className="text-center group">
                  <div className="text-4xl mb-2 flex items-center justify-center gap-2 group-hover:scale-110 transition-transform">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Trophy className="size-6" />
                    </div>
                    <span className="font-bold">95%</span>
                  </div>
                  <div className="text-white/80">Đạt mục tiêu</div>
                </div>
                <div className="text-center group">
                  <div className="text-4xl mb-2 flex items-center justify-center gap-2 group-hover:scale-110 transition-transform">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                      <Star className="size-6" />
                    </div>
                    <span className="font-bold">4.9</span>
                  </div>
                  <div className="text-white/80">Đánh giá 5 sao</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              {/* Floating decorative elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-yellow-400 rounded-2xl opacity-20 blur-xl animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-orange-400 rounded-2xl opacity-20 blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
              
              <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-10 border-2 border-white/30 shadow-2xl hover:shadow-orange-500/20 transition-all group">
                {/* Video/Image Area */}
                <div className="relative aspect-video bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center mb-8 overflow-hidden shadow-xl group-hover:shadow-2xl transition-all">
                  <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
                  <div className="relative flex flex-col items-center gap-4">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                      <Video className="size-10 text-white" />
                    </div>
                    <span className="text-white text-sm font-medium bg-black/20 px-4 py-2 rounded-full">Xem demo AI chấm bài</span>
                  </div>
                  {/* Corner accent */}
                  <div className="absolute top-3 right-3 px-3 py-1 bg-orange-500 text-white text-xs rounded-full font-medium shadow-lg">
                    NEW
                  </div>
                </div>
                
                {/* Features List */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4 bg-white/5 backdrop-blur-sm rounded-xl p-4 hover:bg-white/10 transition-all group/item">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg group-hover/item:scale-110 transition-transform">
                      <Check className="size-6 text-white" />
                    </div>
                    <div>
                      <div className="font-medium">AI chấm điểm chính xác 98%</div>
                      <div className="text-sm text-white/70">Công nghệ Machine Learning tiên tiến</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 bg-white/5 backdrop-blur-sm rounded-xl p-4 hover:bg-white/10 transition-all group/item">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shrink-0 shadow-lg group-hover/item:scale-110 transition-transform">
                      <Zap className="size-6 text-white" />
                    </div>
                    <div>
                      <div className="font-medium">Phản hồi chi tiết trong 5 giây</div>
                      <div className="text-sm text-white/70">Feedback tức thì, học hiệu quả hơn</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 bg-white/5 backdrop-blur-sm rounded-xl p-4 hover:bg-white/10 transition-all group/item">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-700 rounded-xl flex items-center justify-center shrink-0 shadow-lg group-hover/item:scale-110 transition-transform">
                      <Target className="size-6 text-white" />
                    </div>
                    <div>
                      <div className="font-medium">Lộ trình học tập cá nhân hóa</div>
                      <div className="text-sm text-white/70">Tối ưu theo trình độ của bạn</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-20 bg-gradient-to-br from-blue-50 via-blue-100 to-cyan-100 border-b overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-100 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-[1360px] mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl mb-4">
              Được <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent font-bold">50,000+ học viên</span> tin tưởng
            </h2>
            <p className="text-gray-600 text-lg">Hành trình chinh phục VSTEP cùng VSTEPRO</p>
          </div>

          <div className="grid md:grid-cols-5 gap-6">
            {[
              { icon: Users, value: '50,000+', label: 'Học viên', gradient: 'from-blue-500 to-blue-600', bg: 'bg-blue-50' },
              { icon: GraduationCap, value: '15,000+', label: 'Đạt chứng chỉ', gradient: 'from-green-400 to-green-500', bg: 'bg-green-50' },
              { icon: Globe, value: '8', label: 'Đối tác trường học', gradient: 'from-cyan-500 to-cyan-600', bg: 'bg-cyan-50' },
              { icon: Trophy, value: '95%', label: 'Tỷ lệ đạt mục tiêu', gradient: 'from-orange-400 to-orange-500', bg: 'bg-orange-50' },
              { icon: Star, value: '4.9/5', label: 'Đánh giá', gradient: 'from-yellow-500 to-orange-500', bg: 'bg-yellow-50' }
            ].map((stat, idx) => (
              <div 
                key={idx} 
                className="group relative bg-white rounded-2xl p-6 text-center hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-blue-200 hover:scale-105"
              >
                {/* Glow effect on hover */}
                <div className={`absolute inset-0 ${stat.bg} rounded-2xl opacity-0 group-hover:opacity-50 transition-opacity -z-10 blur-xl`}></div>
                
                <div className="flex justify-center mb-4">
                  <div className={`w-16 h-16 bg-gradient-to-br ${stat.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300`}>
                    <stat.icon className="size-8 text-white" />
                  </div>
                </div>
                <div className={`text-4xl font-bold mb-2 bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Trust badges */}
          <div className="mt-12 flex justify-center items-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Shield className="size-5 text-green-600" />
              <span>Bảo mật dữ liệu</span>
            </div>
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
            <div className="flex items-center gap-2">
              <Clock className="size-5 text-blue-600" />
              <span>Hỗ trợ 24/7</span>
            </div>
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
            <div className="flex items-center gap-2">
              <TrendingUp className="size-5 text-orange-600" />
              <span>Hiệu quả đã chứng minh</span>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="section-courses" className="py-20 bg-white">
        <div className="max-w-[1360px] mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-600 rounded-full text-sm mb-6 shadow-lg">
              <BookOpen className="size-4" />
              <span className="font-medium">📚 10 Khóa học đồng bộ A2-C1</span>
            </div>
            <h2 className="text-5xl mb-6">
              Khóa học VSTEP <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent font-bold">chuẩn quốc tế</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Lộ trình học từ A2 đến C1, phù hợp với mọi trình độ. Nội dung được biên soạn bởi đội ngũ chuyên gia với hơn 15 năm kinh nghiệm.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className="group relative bg-white rounded-2xl p-5 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-blue-300 cursor-pointer overflow-hidden hover:-translate-y-2"
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
                
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl group-hover:scale-110 transition-transform">{course.emoji}</div>
                  <div className={`px-3 py-1.5 rounded-lg text-xs font-medium shadow-sm ${course.badgeColor}`}>
                    {course.badge}
                  </div>
                </div>

                {/* Title */}
                <h4 className="text-lg font-bold mb-1 group-hover:text-blue-600 transition-colors">{course.name}</h4>
                <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-4">
                  <BookOpen className="size-3.5" />
                  <span className="font-medium">{course.lessons} bài học</span>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="flex items-center gap-1.5 text-xs bg-blue-50 rounded-lg px-2 py-1.5">
                    <Users className="size-3.5 text-blue-600" />
                    <span className="text-gray-700 font-medium">{course.students}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs bg-cyan-50 rounded-lg px-2 py-1.5">
                    <Calendar className="size-3.5 text-cyan-600" />
                    <span className="text-gray-700 font-medium">{course.sessions} buổi</span>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1.5 mb-4 bg-yellow-50 rounded-lg px-2 py-1.5 w-fit">
                  <Star className="size-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-bold text-gray-800">{course.rating}</span>
                  <span className="text-xs text-gray-500">({course.reviews})</span>
                </div>

                {/* Price */}
                <div className="pt-4 border-t-2 border-gray-100">
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">{course.price}</span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => openCourseDetailModal(course)}
                      className="flex-1 py-2.5 border-2 border-blue-600 text-blue-700 rounded-xl hover:bg-blue-50 transition-all text-sm font-medium flex items-center justify-center gap-1.5 hover:shadow-md"
                    >
                      <Eye className="size-4" />
                      Chi tiết
                    </button>
                    <button 
                      onClick={() => openRegisterModal(course)}
                      className="flex-1 py-2.5 bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-600 text-white rounded-xl hover:shadow-xl transition-all text-sm font-medium group-hover:scale-105"
                    >
                      Đăng ký
                    </button>
                  </div>
                </div>

                {/* Corner accent */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-700 opacity-0 group-hover:opacity-10 blur-2xl transition-opacity"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subscription Plans Section */}
      <section id="section-subscription" className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-[1360px] mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-100 to-blue-100 text-green-700 rounded-full text-sm mb-6 shadow-lg">
              <Zap className="size-4" />
              <span className="font-medium">💎 Gói tự học qua Web</span>
            </div>
            <h2 className="text-5xl mb-6">
              Lựa chọn gói học <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent font-bold">phù hợp với bạn</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Tự học chủ động trên nền tảng Web với AI chấm chữa tự động 4 kỹ năng. Phù hợp cho học viên muốn linh hoạt thời gian, tự rèn luyện và nhận phản hồi tức thì từ hệ thống AI thông minh.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-200 hover:border-green-300 overflow-hidden hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
              
              {/* Header */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300">
                  <Sparkles className="size-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-2 group-hover:text-green-600 transition-colors">Free</h3>
                <div className="text-4xl font-bold bg-gradient-to-r from-gray-600 to-gray-800 bg-clip-text text-transparent mb-2">0đ</div>
                <p className="text-sm text-gray-500">Miễn phí mãi mãi</p>
              </div>

              {/* Features */}
              <div className="space-y-3 mb-8">
                <div className="flex items-start gap-2 text-sm">
                  <Check className="size-5 text-green-600 shrink-0 mt-0.5" />
                  <span className="text-gray-700">5 đề thi mẫu</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <Check className="size-5 text-green-600 shrink-0 mt-0.5" />
                  <span className="text-gray-700">Chấm điểm Reading/Listening</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <Check className="size-5 text-green-600 shrink-0 mt-0.5" />
                  <span className="text-gray-700">Giới hạn 10 bài thi/tháng</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-gray-400">
                  <X className="size-5 shrink-0 mt-0.5" />
                  <span>Không có AI chấm Writing/Speaking</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-gray-400">
                  <X className="size-5 shrink-0 mt-0.5" />
                  <span>Không có báo cáo chi tiết</span>
                </div>
              </div>

              {/* CTA */}
              <button 
                onClick={() => setShowFreeRegisterModal(true)}
                className="w-full py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:shadow-xl transition-all font-medium flex items-center justify-center gap-2 group-hover:scale-105"
              >
                Bắt đầu miễn phí
                <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-400 to-blue-600 opacity-0 group-hover:opacity-10 blur-2xl transition-opacity"></div>
            </div>

            {/* Premium Plan */}
            <div className="group relative bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-blue-300 overflow-hidden hover:-translate-y-2 ring-4 ring-blue-100">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
              
              {/* Popular Badge */}
              <div className="absolute -top-1 -right-1 bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-4 py-1 rounded-bl-xl rounded-tr-xl text-xs font-bold shadow-lg">
                PHỔ BIẾN
              </div>

              {/* Header */}
              <div className="text-center mb-6 mt-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300">
                  <Trophy className="size-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-2 group-hover:text-blue-600 transition-colors">Premium</h3>
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">299k</div>
                <p className="text-sm text-gray-500">/tháng</p>
              </div>

              {/* Features */}
              <div className="space-y-3 mb-8">
                <div className="flex items-start gap-2 text-sm">
                  <Check className="size-5 text-blue-600 shrink-0 mt-0.5" />
                  <span className="text-gray-700 font-medium">50 đề thi đa dạng</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <Check className="size-5 text-blue-600 shrink-0 mt-0.5" />
                  <span className="text-gray-700 font-medium">AI chấm 2 kỹ năng Writing</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <Check className="size-5 text-blue-600 shrink-0 mt-0.5" />
                  <span className="text-gray-700 font-medium">Giới hạn 100 bài thi/tháng</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <Check className="size-5 text-blue-600 shrink-0 mt-0.5" />
                  <span className="text-gray-700 font-medium">Báo cáo chi tiết từng kỹ năng</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <Check className="size-5 text-blue-600 shrink-0 mt-0.5" />
                  <span className="text-gray-700 font-medium">Hỗ trợ email 24/7</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-gray-400">
                  <X className="size-5 shrink-0 mt-0.5" />
                  <span>Không có AI chấm Speaking</span>
                </div>
              </div>

              {/* CTA */}
              <button 
                onClick={() => setShowRegisterModal(true)}
                className="w-full py-3 bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-600 text-white rounded-xl hover:shadow-xl transition-all font-medium flex items-center justify-center gap-2 group-hover:scale-105"
              >
                Nâng cấp Premium
                <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-700 opacity-0 group-hover:opacity-10 blur-2xl transition-opacity"></div>
            </div>

            {/* Pro Plan */}
            <div className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-200 hover:border-orange-300 overflow-hidden hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-red-50 opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
              
              {/* Header */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300">
                  <Award className="size-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-2 group-hover:text-orange-600 transition-colors">Pro</h3>
                <div className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">499k</div>
                <p className="text-sm text-gray-500">/tháng</p>
              </div>

              {/* Features */}
              <div className="space-y-3 mb-8">
                <div className="flex items-start gap-2 text-sm">
                  <Check className="size-5 text-orange-600 shrink-0 mt-0.5" />
                  <span className="text-gray-700 font-medium">Không giới hạn đề thi</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <Check className="size-5 text-orange-600 shrink-0 mt-0.5" />
                  <span className="text-gray-700 font-medium">AI chấm đầy đủ 4 kỹ năng</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <Check className="size-5 text-orange-600 shrink-0 mt-0.5" />
                  <span className="text-gray-700 font-medium">Không giới hạn số lượng bài thi</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <Check className="size-5 text-orange-600 shrink-0 mt-0.5" />
                  <span className="text-gray-700 font-medium">Báo cáo phân tích chuyên sâu</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <Check className="size-5 text-orange-600 shrink-0 mt-0.5" />
                  <span className="text-gray-700 font-medium">Ưu tiên hỗ trợ VIP</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <Check className="size-5 text-orange-600 shrink-0 mt-0.5" />
                  <span className="text-gray-700 font-medium">Roadmap học cá nhân hóa</span>
                </div>
              </div>

              {/* CTA */}
              <button 
                onClick={() => setShowRegisterModal(true)}
                className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl hover:shadow-xl transition-all font-medium flex items-center justify-center gap-2 group-hover:scale-105"
              >
                Nâng cấp Pro
                <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-400 to-red-600 opacity-0 group-hover:opacity-10 blur-2xl transition-opacity"></div>
            </div>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Shield className="size-5 text-green-600" />
              <span>Thanh toán an toàn</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="size-5 text-blue-600" />
              <span>Hủy bất kỳ lúc nào</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="size-5 text-orange-600" />
              <span>10,000+ học viên tin dùng</span>
            </div>
          </div>
        </div>
      </section>

      {/* AI Hub Section */}
      <section id="section-ai-hub" className="py-20 bg-slate-50">
        <div className="max-w-[1360px] mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-50 to-blue-50 text-cyan-600 rounded-full text-sm mb-6 shadow-lg">
              <Brain className="size-4" />
              <span className="font-medium">🤖 AI Learning Hub</span>
            </div>
            <h2 className="text-5xl mb-6">
              Công nghệ AI <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent font-bold">tiên tiến nhất</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Hệ thống AI được đào tạo trên hơn 100,000 bài thi thật, đảm bảo độ chính xác 98% trong việc chấm điểm và phản hồi.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {aiFeatures.map((feature, idx) => (
              <div key={idx} className="group relative bg-white rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-cyan-300 overflow-hidden hover:-translate-y-2">
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
                
                <div className="flex flex-col items-center text-center mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 via-cyan-600 to-blue-600 flex items-center justify-center mb-4 shadow-lg group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300">
                    <feature.icon className="size-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 group-hover:text-cyan-600 transition-colors">{feature.name}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
                
                <div className="space-y-2 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-4 mb-4">
                  {feature.features.map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-gray-700">
                      <Sparkles className="size-3.5 text-cyan-600 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
                
                <button className="w-full px-4 py-2.5 bg-gradient-to-r from-cyan-500 via-cyan-600 to-blue-600 text-white rounded-xl hover:shadow-xl transition-all text-sm font-medium flex items-center justify-center gap-2 group-hover:scale-105">
                  Dùng thử miễn phí
                  <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Corner accent */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-600 opacity-0 group-hover:opacity-10 blur-2xl transition-opacity"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Free Tests Section */}
      <section id="section-free-tests" className="py-20 bg-gradient-to-br from-white via-orange-50 to-red-50">
        <div className="max-w-[1360px] mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 rounded-full text-sm mb-6 shadow-lg">
              <Trophy className="size-4" />
              <span className="font-medium">🎁 Thi thử miễn phí - Không cần thanh toán</span>
            </div>
            <h2 className="text-5xl mb-6">
              Trải nghiệm <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent font-bold">VSTEP thật 100%</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-4">
              Đăng ký tài khoản Free ngay hôm nay để nhận <span className="font-bold text-orange-600">5 đề thi chuẩn VSTEP</span> và <span className="font-bold text-orange-600">10 lượt thi miễn phí/tháng</span>. Trải nghiệm giao diện thi như thật, chấm điểm tự động Reading & Listening!
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Check className="size-5 text-green-600" />
                <span>Không cần thẻ tín dụng</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="size-5 text-green-600" />
                <span>Miễn phí mãi mãi</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="size-5 text-green-600" />
                <span>Đăng ký 30 giây</span>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Giao diện thi thật 100%',
                description: 'Mô phỏng chính xác môi trường thi VSTEP thực tế với đồng hồ đếm ngược, navigation bar và trải nghiệm như thi tại trung tâm',
                icon: Trophy,
                color: 'from-orange-500 to-red-500',
                badge: 'Giống thật',
                features: ['Đồng hồ đếm ngược', 'Điều hướng câu hỏi', 'Giao diện chuẩn']
              },
              {
                title: 'Chấm điểm tức thì',
                description: 'Hệ thống AI chấm điểm Reading & Listening tự động ngay sau khi nộp bài. Xem đáp án, giải thích chi tiết từng câu hỏi',
                icon: Zap,
                color: 'from-blue-600 to-cyan-600',
                badge: 'AI Smart',
                features: ['Kết quả tức thì', 'Giải thích đáp án', 'Phân tích lỗi sai']
              },
              {
                title: '5 đề thi chuẩn VSTEP',
                description: 'Truy cập miễn phí 5 đề thi được biên soạn bởi giảng viên 15 năm kinh nghiệm, cập nhật theo format VSTEP mới nhất 2025',
                icon: BookOpen,
                color: 'from-blue-600 to-cyan-600',
                badge: 'Chuẩn 2025',
                features: ['Đề thi từ A2-C1', '4 kỹ năng đầy đủ', 'Format mới nhất']
              }
            ].map((test, idx) => (
              <div key={idx} className="group relative bg-white rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-orange-300 overflow-hidden hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-red-50 opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
                
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 bg-gradient-to-r ${test.color} text-white shadow-md`}>
                  {test.badge}
                </div>

                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${test.color} flex items-center justify-center mb-4 shadow-lg group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300`}>
                  <test.icon className="size-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold mb-3 group-hover:text-orange-600 transition-colors">{test.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{test.description}</p>
                
                <div className="space-y-2 mb-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4">
                  {test.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <Check className="size-4 text-orange-600 shrink-0 mt-0.5" />
                      <span className="font-medium">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-400 to-red-600 opacity-0 group-hover:opacity-10 blur-2xl transition-opacity"></div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-red-600 rounded-3xl p-12 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-40 h-40 bg-white opacity-10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 right-0 w-60 h-60 bg-white opacity-10 rounded-full blur-3xl"></div>
              
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm mb-6">
                  <Sparkles className="size-4" />
                  <span className="font-medium">Đã có 50,000+ học viên đăng ký</span>
                </div>
                <h3 className="text-4xl font-bold text-white mb-4">
                  Sẵn sàng chinh phục VSTEP?
                </h3>
                <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                  Tạo tài khoản miễn phí ngay để bắt đầu hành trình luyện thi VSTEP hiệu quả cùng VSTEPRO!
                </p>
                <button 
                  onClick={() => setShowFreeRegisterModal(true)}
                  className="inline-flex items-center gap-3 px-10 py-4 bg-white text-orange-600 rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  <Trophy className="size-6" />
                  Đăng ký miễn phí ngay
                  <ArrowRight className="size-6" />
                </button>
                <p className="text-white/80 text-sm mt-4">
                  ⚡ Chỉ mất 30 giây • Không cần thẻ tín dụng • Miễn phí mãi mãi
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section id="section-resources" className="py-20 bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <div className="max-w-[1360px] mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-full text-sm mb-6 shadow-lg">
              <BookOpen className="size-4" />
              <span className="font-medium">📚 Học liệu & Tài nguyên miễn phí</span>
            </div>
            <h2 className="text-5xl mb-6">
              Kho tài liệu <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent font-bold">học tập khổng lồ</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Hơn <span className="font-bold text-green-600">2,000+ tài liệu chất lượng cao</span> được biên soạn bởi đội ngũ chuyên gia, cập nhật liên tục theo format VSTEP mới nhất. Hoàn toàn miễn phí cho mọi học viên!
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { 
                icon: FileText, 
                name: 'Đề thi mẫu', 
                count: '500+', 
                description: 'Đề thi VSTEP chuẩn format, phân loại theo cấp độ A2-C1 với đáp án chi tiết', 
                color: 'from-blue-600 to-cyan-600',
                highlight: 'Chuẩn format'
              },
              { 
                icon: Award, 
                name: 'Band Descriptors', 
                count: 'A2-C1', 
                description: 'Bảng mô tả chi tiết yêu cầu từng band điểm, giúp bạn tự đánh giá chính xác', 
                color: 'from-blue-600 to-cyan-600',
                highlight: 'Chính thức'
              },
              { 
                icon: BookOpen, 
                name: 'Kỹ năng 4.0', 
                count: '200+', 
                description: 'Chiến lược làm bài, tips & tricks từ giảng viên 8.5+, phương pháp học hiệu quả', 
                color: 'from-orange-500 to-red-500',
                highlight: 'Độc quyền'
              },
              { 
                icon: Headphones, 
                name: 'Audio Library', 
                count: '1000+', 
                description: 'Bài nghe đa dạng giọng đọc (Anh-Mỹ-Úc), tốc độ từ chậm đến nhanh', 
                color: 'from-green-500 to-emerald-500',
                highlight: 'Đa dạng'
              },
              { 
                icon: Video, 
                name: 'Video HD', 
                count: '300+', 
                description: 'Video hướng dẫn từng phần thi, kỹ thuật làm bài, phân tích đề chi tiết', 
                color: 'from-indigo-500 to-blue-600',
                highlight: 'Chất lượng cao'
              }
            ].map((resource, idx) => (
              <div key={idx} className="group relative bg-white rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-green-300 text-center overflow-hidden hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
                
                <div className="absolute top-4 right-4 px-2 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                  {resource.highlight}
                </div>

                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${resource.color} flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300`}>
                  <resource.icon className="size-8 text-white" />
                </div>
                
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 bg-gradient-to-r ${resource.color} text-white shadow-md`}>
                  {resource.count} tài liệu
                </div>
                
                <h3 className="text-xl font-bold mb-3 group-hover:text-green-600 transition-colors">{resource.name}</h3>
                <p className="text-sm text-gray-600 mb-5 leading-relaxed min-h-[60px]">{resource.description}</p>
                
                <button className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 text-sm font-medium group-hover:gap-3 transition-all">
                  Khám phá ngay
                  <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 opacity-0 group-hover:opacity-5 blur-2xl transition-opacity"></div>
              </div>
            ))}
          </div>

          <div className="mt-12 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="text-center p-6 bg-white rounded-2xl border-2 border-green-100 shadow-lg">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-3">
                <Globe className="size-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-green-600 mb-1">100%</div>
              <div className="text-sm text-gray-600">Miễn phí trọn đời</div>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl border-2 border-blue-100 shadow-lg">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="size-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-blue-600 mb-1">Hàng tuần</div>
              <div className="text-sm text-gray-600">Cập nhật nội dung mới</div>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl border-2 border-cyan-100 shadow-lg">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center mx-auto mb-3">
                <Shield className="size-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-cyan-600 mb-1">Chính thức</div>
              <div className="text-sm text-gray-600">Từ nguồn uy tín</div>
            </div>
          </div>
        </div>
      </section>

      {/* Feedback & Testimonials Section */}
      <section id="section-feedback" className="py-20 bg-gradient-to-br from-yellow-50 via-white to-orange-50">
        <div className="max-w-[1360px] mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-700 rounded-full text-sm mb-6 shadow-lg">
              <Star className="size-4" />
              <span className="font-medium">⭐ Câu chuyện thành công</span>
            </div>
            <h2 className="text-5xl mb-6">
              <span className="bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent font-bold">15,000+ học viên</span> đạt mục tiêu
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Những câu chuyện truyền cảm hứng từ học viên đã <span className="font-bold text-orange-600">chinh phục VSTEP</span> và thay đổi cuộc đời với VSTEPRO. Đánh giá trung bình <span className="font-bold text-yellow-600">4.9/5.0 ⭐</span>
            </p>
          </div>

          <div className="relative">
            <div className="overflow-x-auto scrollbar-hide pb-8 -mx-6 px-6">
              <div className="flex gap-6 min-w-min">
                {testimonials.map((testimonial, idx) => {
                  const studentImages = [
                    "https://images.unsplash.com/photo-1561065533-316e3142d586?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMHN0dWRlbnQlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjY2NTUxNjd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                    "https://images.unsplash.com/photo-1731662262743-d4ed80b88672?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHN0dWRlbnQlMjBzbWlsaW5nfGVufDF8fHx8MTc2NjY1NTE2N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                    "https://images.unsplash.com/photo-1718179804654-7c3720b78e67?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NjYyNTc5MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                    "https://images.unsplash.com/photo-1591655630844-28e59efe0c7d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjBzdHVkZW50JTIwZ3JhZHVhdGlvbnxlbnwxfHx8fDE3NjY1Njc1MTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                    "https://images.unsplash.com/photo-1717010029992-73634991491f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxlJTIwc3R1ZGVudCUyMHN1Y2Nlc3N8ZW58MXx8fHwxNzY2NjU1MTY4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                    "https://images.unsplash.com/photo-1639654655546-68bc1f21e9e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwc3R1ZGVudCUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NjYwODM2MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  ];

                  return (
                    <div key={idx} className="group relative bg-white rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500 border-2 border-gray-100 hover:border-yellow-300 w-[420px] flex-shrink-0 hover:-translate-y-2">
                      <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                      
                      <div className="relative h-48 overflow-hidden">
                        <img 
                          src={studentImages[idx % studentImages.length]} 
                          alt={testimonial.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                        
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm rounded-full shadow-2xl font-bold">
                            <Trophy className="size-4" />
                            {testimonial.achievement}
                          </div>
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="flex items-center gap-1 mb-4">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="size-5 fill-yellow-400 text-yellow-400" />
                          ))}
                          <span className="ml-2 text-sm font-bold text-gray-700">{testimonial.rating}.0</span>
                        </div>

                        <p className="text-gray-700 text-sm mb-5 leading-relaxed italic min-h-[80px]">
                          "{testimonial.review}"
                        </p>

                        <div className="pt-5 border-t border-gray-100">
                          <h4 className="font-bold text-lg mb-1 text-gray-800">{testimonial.name}</h4>
                          <div className="text-sm text-gray-600 mb-2">{testimonial.school}</div>
                          <div className="text-xs text-gray-500">{testimonial.date}</div>
                        </div>
                      </div>

                      <div className="absolute top-44 right-6 text-8xl text-yellow-400/20 font-serif leading-none">"</div>
                      
                      <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-600 opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-500"></div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="absolute left-0 top-0 bottom-8 w-12 bg-gradient-to-r from-yellow-50 to-transparent pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-8 w-12 bg-gradient-to-l from-yellow-50 to-transparent pointer-events-none"></div>
          </div>

          <div className="text-center mt-12">
            <button className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-xl hover:shadow-2xl transition-all shadow-lg font-bold hover:-translate-y-1">
              <MessageSquare className="size-5" />
              Xem tất cả 500+ câu chuyện thành công
              <ArrowRight className="size-5" />
            </button>
            <p className="text-sm text-gray-500 mt-4">💬 Kéo sang trái để xem thêm đánh giá</p>
          </div>
        </div>
      </section>

      {/* Teachers Section */}
      <section id="section-teachers" className="py-20 bg-white">
        <div className="max-w-[1360px] mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-sky-100 to-blue-100 text-blue-700 rounded-full text-sm mb-6 shadow-lg">
              <GraduationCap className="size-4" />
              <span className="font-medium">👨‍🏫 Đội ngũ giảng viên chuyên nghiệp</span>
            </div>
            <h2 className="text-5xl mb-6">
              Học cùng <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent font-bold">chuyên gia hàng đầu</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Đội ngũ giảng viên <span className="font-bold text-blue-600">15+ năm kinh nghiệm</span>, chứng chỉ quốc tế IELTS 8.5+, TESOL, CELTA. Đã đồng hành cùng <span className="font-bold text-blue-600">hơn 25,000 học viên</span> chinh phục VSTEP thành công.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teachers.map((teacher, idx) => {
              const teacherImages = [
                "https://images.unsplash.com/photo-1544972917-3529b113a469?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB0ZWFjaGVyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzY2NjI4MTA4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                "https://images.unsplash.com/photo-1758270704587-43339a801396?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjBwcm9mZXNzb3IlMjB0ZWFjaGluZ3xlbnwxfHx8fDE3NjY2NTQ5MTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                "https://images.unsplash.com/photo-1584554376766-ac0f2c65e949?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxlJTIwdGVhY2hlciUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NjY1ODQ4OTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                "https://images.unsplash.com/photo-1515994034738-1f437c226687?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHRlYWNoZXIlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjY2NTQ5MTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                "https://images.unsplash.com/photo-1752649935124-f5a7ac531a97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHRlYWNoZXIlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzY2NTYxNjkzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                "https://images.unsplash.com/photo-1758685848006-1bc450061624?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxleHBlcmllbmNlZCUyMGVkdWNhdG9yJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzY2NjU0OTExfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              ];
              
              return (
                <div key={idx} className="group relative bg-white rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500 border-2 border-gray-100 hover:border-blue-300 hover:-translate-y-3">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                  
                  <div className="relative overflow-hidden">
                    <img 
                      src={teacherImages[idx]} 
                      alt={teacher.name}
                      className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    
                    <div className="absolute top-4 right-4 px-4 py-2 bg-white/95 backdrop-blur-sm rounded-full shadow-xl">
                      <div className="text-xs font-bold text-blue-600">{teacher.specialty}</div>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="text-2xl font-bold mb-1">{teacher.name}</h3>
                      <div className="text-sm text-white/90">{teacher.title}</div>
                    </div>
                  </div>

                  <div className="p-6">
                    <p className="text-sm text-gray-700 mb-5 leading-relaxed">{teacher.description}</p>
                    
                    <div className="space-y-2.5 mb-5">
                      {teacher.credentials.map((cred, i) => (
                        <div key={i} className="flex items-start gap-3 text-sm text-gray-700">
                          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="size-3 text-white" />
                          </div>
                          <span className="font-medium">{cred}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="pt-5 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                          <Trophy className="size-4 text-white" />
                        </div>
                        <span className="font-bold text-gray-800">{teacher.achievements}</span>
                      </div>
                    </div>
                  </div>

                  <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-blue-600 to-cyan-600 opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-500"></div>
                </div>
              );
            })}
          </div>

          <div className="mt-16 grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <div className="text-center p-6 bg-white rounded-2xl border-2 border-blue-100 shadow-lg hover:shadow-2xl transition-all">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center mx-auto mb-3">
                <Users className="size-7 text-white" />
              </div>
              <div className="text-3xl font-bold text-blue-600 mb-1">25,000+</div>
              <div className="text-sm text-gray-600">Học viên thành công</div>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl border-2 border-cyan-100 shadow-lg hover:shadow-2xl transition-all">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center mx-auto mb-3">
                <Award className="size-7 text-white" />
              </div>
              <div className="text-3xl font-bold text-cyan-600 mb-1">IELTS 8.5+</div>
              <div className="text-sm text-gray-600">Chứng chỉ quốc tế</div>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl border-2 border-orange-100 shadow-lg hover:shadow-2xl transition-all">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mx-auto mb-3">
                <Clock className="size-7 text-white" />
              </div>
              <div className="text-3xl font-bold text-orange-600 mb-1">15+ năm</div>
              <div className="text-sm text-gray-600">Kinh nghiệm giảng dạy</div>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl border-2 border-green-100 shadow-lg hover:shadow-2xl transition-all">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-3">
                <Star className="size-7 text-white" />
              </div>
              <div className="text-3xl font-bold text-green-600 mb-1">4.9/5.0</div>
              <div className="text-sm text-gray-600">Đánh giá học viên</div>
            </div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section id="section-events" className="py-20 bg-white">
        <div className="max-w-[1360px] mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-2 bg-orange-100 text-orange-600 rounded-full text-sm mb-4">
              📅 Sự kiện & Lịch khai giảng
            </div>
            <h2 className="text-4xl mb-4">Sự kiện sắp tới</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tham gia các sự kiện, workshop và khóa học mới để nâng cao kỹ năng tiếng Anh.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 hover:shadow-xl transition-all border">
                <div className={`h-2 rounded-full bg-gradient-to-r ${event.color} mb-4`} />
                <div className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full mb-3">
                  {event.type}
                </div>
                <h3 className="text-xl mb-3">{event.title}</h3>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="size-4 text-blue-600" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="size-4 text-blue-600" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="size-4 text-blue-600" />
                    <span>{event.location}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-sm text-orange-600">⚡ {event.spots}</div>
                  <button className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors text-sm">
                    Đăng ký
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section id="section-partners" className="py-20 bg-slate-50">
        <div className="max-w-[1360px] mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-700 rounded-full text-sm mb-6 shadow-lg">
              <Building2 className="size-4" />
              <span className="font-medium">🤝 Đối tác chiến lược</span>
            </div>
            <h2 className="text-5xl mb-6">
              Được <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent font-bold">tin tưởng</span> hợp tác
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Hợp tác chiến lược với <span className="font-bold text-cyan-600">50+ trường đại học</span> hàng đầu và doanh nghiệp lớn tại Việt Nam
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
            {partners.map((partner, idx) => (
              <div key={idx} className="group relative bg-white rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-cyan-300 text-center hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl -z-10"></div>
                <div className="text-5xl mb-3 group-hover:scale-110 transition-transform duration-300">{partner.logo}</div>
                <h3 className="text-xs font-medium text-gray-700 group-hover:text-cyan-600 transition-colors">{partner.name}</h3>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-gray-500">Và hơn 50+ đối tác khác trên toàn quốc</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {/* Scroll to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 w-12 h-12 bg-sky-500 text-white rounded-full shadow-lg hover:bg-sky-600 transition-all hover:scale-110 flex items-center justify-center z-40"
      >
        ↑
      </button>

      {/* Course Detail Modal */}
      {showCourseDetailModal && selectedCourse && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between z-10">
              <div className="flex items-center gap-4">
                <div className="text-4xl">{selectedCourse.emoji}</div>
                <div>
                  <h3 className="text-2xl font-bold">{selectedCourse.name}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className={`px-3 py-1 rounded-lg text-sm ${selectedCourse.badgeColor}`}>
                      {selectedCourse.badge}
                    </span>
                    <span className="text-sm text-gray-600">{selectedCourse.level}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowCourseDetailModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="size-6 text-gray-500" />
              </button>
            </div>

            <div className="px-8 py-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-4 gap-4 mb-8">
                <div className="bg-sky-50 rounded-xl p-4 text-center">
                  <Calendar className="size-6 text-sky-600 mx-auto mb-2" />
                  <div className="text-sm text-gray-600">Thời lượng</div>
                  <div className="font-bold text-gray-900">{selectedCourse.duration}</div>
                </div>
                <div className="bg-cyan-50 rounded-xl p-4 text-center">
                  <BookOpen className="size-6 text-cyan-600 mx-auto mb-2" />
                  <div className="text-sm text-gray-600">Bài học</div>
                  <div className="font-bold text-gray-900">{selectedCourse.lessons} bài</div>
                </div>
                <div className="bg-green-50 rounded-xl p-4 text-center">
                  <Users className="size-6 text-green-600 mx-auto mb-2" />
                  <div className="text-sm text-gray-600">Học viên</div>
                  <div className="font-bold text-gray-900">{selectedCourse.students}+</div>
                </div>
                <div className="bg-yellow-50 rounded-xl p-4 text-center">
                  <Star className="size-6 text-yellow-600 mx-auto mb-2" />
                  <div className="text-sm text-gray-600">Đánh giá</div>
                  <div className="font-bold text-gray-900">{selectedCourse.rating}/5</div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h4 className="text-xl font-bold mb-3 flex items-center gap-2">
                  <FileText className="size-5 text-sky-600" />
                  Giới thiệu khóa học
                </h4>
                <p className="text-gray-700 leading-relaxed">{selectedCourse.description}</p>
              </div>

              {/* Video Introduction */}
              {selectedCourse.videoUrl && (
                <div className="mb-8">
                  <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Video className="size-5 text-sky-600" />
                    Video giới thiệu khóa học
                  </h4>
                  <div className="relative rounded-xl overflow-hidden shadow-lg aspect-video bg-gray-100">
                    <iframe
                      src={selectedCourse.videoUrl}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              )}

              {/* Instructor */}
              {selectedCourse.instructor && (
                <div className="mb-8 bg-gradient-to-r from-sky-50 to-blue-50 rounded-xl p-6">
                  <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <GraduationCap className="size-5 text-sky-600" />
                    Giảng viên
                  </h4>
                  <div className="flex items-center gap-4">
                    <div className="text-5xl">{selectedCourse.instructor.avatar}</div>
                    <div>
                      <div className="font-bold text-lg">{selectedCourse.instructor.name}</div>
                      <div className="text-gray-600">{selectedCourse.instructor.title}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Curriculum - Timeline Visualization */}
              {selectedCourse.curriculum && selectedCourse.curriculum.length > 0 && (
                <div className="mb-8">
                  <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <BookOpen className="size-5 text-sky-600" />
                    Lộ trình học tập
                  </h4>
                  <div className="relative">
                    {/* Timeline Line */}
                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-sky-600 via-blue-600 to-cyan-600"></div>
                    
                    <div className="space-y-6">
                      {selectedCourse.curriculum.map((item: any, index: number) => (
                        <div key={index} className="relative pl-16 group">
                          {/* Timeline Dot */}
                          <div className="absolute left-0 w-12 h-12 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <span className="text-white font-bold text-sm">
                              {typeof item.week === 'string' ? item.week.split('-')[0] : `W${item.week}`}
                            </span>
                          </div>
                          
                          {/* Content Card */}
                          <div className="bg-white border-2 border-gray-100 rounded-xl p-5 hover:border-sky-200 hover:shadow-lg transition-all">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <div className="font-bold text-lg text-gray-900 mb-1">{item.title}</div>
                                <div className="text-xs text-gray-500">
                                  {typeof item.week === 'string' ? `Tuần ${item.week}` : `Tuần ${item.week}`}
                                </div>
                              </div>
                              <div className="px-2 py-1 bg-sky-100 text-sky-600 rounded text-xs font-semibold">
                                {index + 1}/{selectedCourse.curriculum.length}
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {item.topics.map((topic: string, idx: number) => (
                                <span key={idx} className="text-xs bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 px-3 py-1.5 rounded-full border border-gray-200">
                                  • {topic}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Benefits */}
              {selectedCourse.benefits && selectedCourse.benefits.length > 0 && (
                <div className="mb-8">
                  <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Sparkles className="size-5 text-sky-600" />
                    Lợi ích khóa học
                  </h4>
                  <div className="grid md:grid-cols-2 gap-3">
                    {selectedCourse.benefits.map((benefit: string, index: number) => (
                      <div key={index} className="flex items-start gap-3 bg-green-50 rounded-lg p-3">
                        <Check className="size-5 text-green-600 shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Learning Outcomes */}
              {selectedCourse.outcomes && selectedCourse.outcomes.length > 0 && (
                <div className="mb-8">
                  <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Target className="size-5 text-sky-600" />
                    Kết quả đạt được
                  </h4>
                  <div className="space-y-2">
                    {selectedCourse.outcomes.map((outcome: string, index: number) => (
                      <div key={index} className="flex items-start gap-3">
                        <Trophy className="size-5 text-yellow-600 shrink-0 mt-0.5" />
                        <span className="text-gray-700">{outcome}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Student Reviews */}
              {selectedCourse.studentReviews && selectedCourse.studentReviews.length > 0 && (
                <div className="mb-8">
                  <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <MessageSquare className="size-5 text-sky-600" />
                    Đánh giá từ học viên
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    {selectedCourse.studentReviews.map((review: any, index: number) => (
                      <div key={index} className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-100 rounded-xl p-4 hover:border-sky-200 hover:shadow-md transition-all">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="text-3xl">{review.avatar}</div>
                          <div className="flex-1">
                            <div className="font-bold text-gray-900">{review.name}</div>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex items-center gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`size-3 ${
                                      i < review.rating
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'fill-gray-200 text-gray-200'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-xs text-gray-500">• {review.date}</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed italic">"{review.comment}"</p>
                      </div>
                    ))}
                  </div>
                  <div className="text-center mt-4">
                    <div className="text-sm text-gray-500">
                      ⭐ {selectedCourse.rating}/5 từ {selectedCourse.reviews}+ đánh giá
                    </div>
                  </div>
                </div>
              )}

              {/* Price & CTA */}
              <div className="bg-gradient-to-r from-sky-500 to-blue-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm opacity-90 mb-1">Học phí khóa học</div>
                    <div className="text-3xl font-bold">{selectedCourse.price}</div>
                    <div className="text-sm opacity-90 mt-2">⭐ {selectedCourse.rating}/5 từ {selectedCourse.reviews} đánh giá</div>
                  </div>
                  <button
                    onClick={() => {
                      setShowCourseDetailModal(false);
                      openRegisterModal(selectedCourse);
                    }}
                    className="px-8 py-3 bg-white text-sky-600 rounded-lg hover:bg-gray-50 transition-all font-bold shadow-lg"
                  >
                    Đăng ký ngay
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Registration Modal */}
      {showRegisterModal && selectedCourse && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[95vh] overflow-y-auto">{/*  increased from max-w-2xl to max-w-3xl and 90vh to 95vh */}
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-700 to-blue-900 text-white p-6 rounded-t-2xl">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl mb-2">Đăng ký & Thanh toán</h3>
                  <p className="text-blue-100 text-sm">Điền thông tin và chọn gói thanh toán phù hợp</p>
                </div>
                <button
                  onClick={closeRegisterModal}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="size-5" />
                </button>
              </div>
              
              {/* Selected Course Info */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{selectedCourse.emoji}</div>
                  <div className="flex-1">
                    <div className="font-semibold text-lg">{selectedCourse.name}</div>
                    <div className="text-blue-100 text-sm">{selectedCourse.level} • {selectedCourse.duration} • {selectedCourse.lessons} bài học</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{selectedCourse.price}</div>
                    <div className={`inline-block px-2 py-1 rounded-md text-xs mt-1 ${selectedCourse.badgeColor}`}>
                      {selectedCourse.badge}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Body - Form */}
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Nguyễn Văn A"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all ${
                      formErrors.fullName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.fullName && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.fullName}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="email@example.com"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all ${
                      formErrors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.email && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="0912345678"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all ${
                      formErrors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.phone && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mật khẩu <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Tối thiểu 6 ký tự"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all ${
                      formErrors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.password && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Xác nhận mật khẩu <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Nhập lại mật khẩu"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all ${
                      formErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.confirmPassword}</p>
                  )}
                </div>

                {/* Terms Agreement */}
                <div>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleInputChange}
                      className="mt-1 w-4 h-4 text-blue-700 border-gray-300 rounded focus:ring-blue-600"
                    />
                    <span className="text-sm text-gray-700">
                      Tôi đồng ý với{' '}
                      <a href="#" className="text-blue-600 hover:underline">Điều khoản sử dụng</a>
                      {' '}và{' '}
                      <a href="#" className="text-blue-600 hover:underline">Chính sách bảo mật</a>
                      {' '}của VSTEPRO
                    </span>
                  </label>
                  {formErrors.agreeTerms && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.agreeTerms}</p>
                  )}
                </div>

                {/* Benefits */}
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Trophy className="size-5 text-blue-600" />
                    <h4 className="font-semibold text-blue-900">Quyền lợi khi đăng ký</h4>
                  </div>
                  <div className="space-y-2">
                    {selectedCourse.features.map((feature: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-blue-800">
                        <Check className="size-4 text-blue-600 shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Section */}
                <div className="border-t-2 border-gray-200 pt-6 mt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <CreditCard className="size-6 text-blue-600" />
                    <h4 className="text-lg font-semibold text-gray-900">Thông tin thanh toán</h4>
                  </div>

                  {/* Duration Selection */}
                  <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Chọn thời hạn gói học <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { months: 1, discount: 0, label: '1 tháng', badge: '' },
                        { months: 3, discount: 5, label: '3 tháng', badge: '−5%' },
                        { months: 6, discount: 10, label: '6 tháng', badge: '−10%' },
                        { months: 12, discount: 20, label: '12 tháng', badge: '−20%' }
                      ].map((option) => {
                        const basePrice = parseInt(selectedCourse.price.replace(/[.,đ]/g, ''));
                        const totalBeforeDiscount = basePrice * option.months;
                        const totalAfterDiscount = Math.round(totalBeforeDiscount * (1 - option.discount / 100));
                        const isSelected = paymentData.duration === option.months;
                        
                        return (
                          <button
                            key={option.months}
                            type="button"
                            onClick={() => setPaymentData(prev => ({ ...prev, duration: option.months }))}
                            className={`relative p-3 rounded-xl border-2 transition-all text-left ${
                              isSelected 
                                ? 'border-blue-600 bg-blue-50 shadow-md' 
                                : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                            }`}
                          >
                            {option.badge && (
                              <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                                {option.badge}
                              </div>
                            )}
                            <div className={`text-sm font-semibold mb-1 ${isSelected ? 'text-blue-700' : 'text-gray-900'}`}>
                              {option.label}
                            </div>
                            <div className={`text-xs ${isSelected ? 'text-blue-600' : 'text-gray-500'}`}>
                              {totalAfterDiscount.toLocaleString()}đ
                            </div>
                            {option.discount > 0 && (
                              <div className="text-xs text-gray-400 line-through mt-0.5">
                                {totalBeforeDiscount.toLocaleString()}đ
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Auto Renew Toggle */}
                  <div className="mb-5 bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <label className="flex items-center justify-between cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                          <Zap className="size-5 text-green-600" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">Gia hạn tự động</div>
                          <div className="text-xs text-gray-500">Tiết kiệm 10% khi gia hạn tự động</div>
                        </div>
                      </div>
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={paymentData.autoRenew}
                          onChange={(e) => setPaymentData(prev => ({ ...prev, autoRenew: e.target.checked }))}
                          className="sr-only peer"
                        />
                        <div className={`w-11 h-6 rounded-full transition-colors ${
                          paymentData.autoRenew ? 'bg-blue-600' : 'bg-gray-300'
                        }`}></div>
                        <div className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          paymentData.autoRenew ? 'translate-x-5' : ''
                        }`}></div>
                      </div>
                    </label>
                  </div>

                  {/* Payment Method Selection */}
                  <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Phương thức thanh toán <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-3">
                      {[
                        { value: 'bank', label: 'Chuyển khoản ngân hàng', icon: Building2, description: 'Chuyển khoản trực tiếp qua QR Code' }
                      ].map((method) => {
                        const isSelected = paymentData.paymentMethod === method.value;
                        return (
                          <button
                            key={method.value}
                            type="button"
                            onClick={() => setPaymentData(prev => ({ ...prev, paymentMethod: method.value }))}
                            className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                              isSelected 
                                ? 'border-blue-600 bg-blue-50 shadow-md' 
                                : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                            }`}
                          >
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                              isSelected ? 'bg-blue-100' : 'bg-gray-100'
                            }`}>
                              <method.icon className={`size-6 ${isSelected ? 'text-blue-600' : 'text-gray-500'}`} />
                            </div>
                            <div className="flex-1">
                              <div className={`text-sm font-semibold mb-1 ${isSelected ? 'text-blue-700' : 'text-gray-900'}`}>
                                {method.label}
                              </div>
                              <div className={`text-xs ${isSelected ? 'text-blue-600' : 'text-gray-500'}`}>
                                {method.description}
                              </div>
                            </div>
                            {isSelected && (
                              <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                                <Check className="size-4 text-white" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* QR Code Section - Show when Bank Transfer is selected */}
                  {paymentData.paymentMethod === 'bank' && (
                    <div className="mb-5 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border-2 border-blue-200">
                      <div className="flex items-center gap-2 mb-4">
                        <Building2 className="size-5 text-blue-600" />
                        <h4 className="font-semibold text-blue-900">Thông tin chuyển khoản</h4>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* QR Code */}
                        <div className="flex flex-col items-center justify-center">
                          <div className="bg-white p-4 rounded-2xl shadow-lg border-2 border-blue-300 mb-3">
                            <div className="w-48 h-48 bg-white flex items-center justify-center">
                              {/* QR Code Placeholder */}
                              <div className="text-center">
                                <div className="text-6xl mb-2">📱</div>
                                <div className="text-sm text-gray-500">Mã QR</div>
                                <div className="text-xs text-gray-400 mt-1">Quét để thanh toán</div>
                              </div>
                            </div>
                          </div>
                          <div className="text-xs text-gray-500 text-center">
                            Quét mã QR bằng ứng dụng ngân hàng
                          </div>
                        </div>

                        {/* Bank Details */}
                        <div className="space-y-4">
                          <div className="bg-white rounded-xl p-4 border border-blue-200">
                            <div className="text-xs text-gray-500 mb-1">Ngân hàng</div>
                            <div className="font-semibold text-gray-900 flex items-center gap-2">
                              <span>🏦</span>
                              <span>Vietcombank - Chi nhánh Hà Nội</span>
                            </div>
                          </div>

                          <div className="bg-white rounded-xl p-4 border border-blue-200">
                            <div className="text-xs text-gray-500 mb-1">Số tài khoản</div>
                            <div className="font-semibold text-gray-900 text-lg flex items-center justify-between">
                              <span>1234567890</span>
                              <button
                                type="button"
                                onClick={async () => {
                                  const success = await copyToClipboard('1234567890');
                                  if (success) {
                                    alert('✅ Đã copy số tài khoản!');
                                  } else {
                                    alert('❌ Không thể copy. Vui lòng copy thủ công: 1234567890');
                                  }
                                }}
                                className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
                              >
                                <Eye className="size-4" />
                                Copy
                              </button>
                            </div>
                          </div>

                          <div className="bg-white rounded-xl p-4 border border-blue-200">
                            <div className="text-xs text-gray-500 mb-1">Chủ tài khoản</div>
                            <div className="font-semibold text-gray-900">
                              CÔNG TY VSTEPRO EDUCATION
                            </div>
                          </div>

                          <div className="bg-white rounded-xl p-4 border border-blue-200">
                            <div className="text-xs text-gray-500 mb-1">Số tiền</div>
                            <div className="font-bold text-xl text-blue-600">
                              {Math.round(calculateTotalPrice() * (paymentData.autoRenew ? 0.9 : 1)).toLocaleString()}đ
                            </div>
                          </div>

                          <div className="bg-white rounded-xl p-4 border border-orange-200">
                            <div className="text-xs text-gray-500 mb-1">Nội dung chuyển khoản</div>
                            <div className="font-semibold text-gray-900 flex items-center justify-between">
                              <span className="text-sm">VSTEP {formData.phone || 'SDT'}</span>
                              <button
                                type="button"
                                onClick={async () => {
                                  const content = `VSTEP ${formData.phone || 'SDT'}`;
                                  const success = await copyToClipboard(content);
                                  if (success) {
                                    alert('✅ Đã copy nội dung chuyển khoản!');
                                  } else {
                                    alert(`❌ Không thể copy. Vui lòng copy thủ công: ${content}`);
                                  }
                                }}
                                className="text-orange-600 hover:text-orange-700 text-sm flex items-center gap-1"
                              >
                                <Eye className="size-4" />
                                Copy
                              </button>
                            </div>
                            <div className="text-xs text-orange-600 mt-2 flex items-start gap-1">
                              <span>⚠���</span>
                              <span>Vui lòng nhập chính xác nội dung để xác nhận tự động</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                        <div className="flex gap-3">
                          <div className="text-yellow-600 text-xl shrink-0">💡</div>
                          <div className="text-sm text-yellow-800">
                            <div className="font-semibold mb-1">Lưu ý quan trọng:</div>
                            <ul className="space-y-1 text-xs">
                              <li>• Tài khoản sẽ được kích hoạt tự động sau 5-10 phút</li>
                              <li>• Vui lòng chuyển khoản đúng số tiền và nội dung</li>
                              <li>• Liên hệ hotline <span className="font-semibold">1900.xxxx</span> nếu cần hỗ trợ</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Price Summary */}
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border-2 border-blue-200">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Giá gốc ({paymentData.duration} tháng)</span>
                        <span className="text-gray-900">
                          {(parseInt(selectedCourse.price.replace(/[.,đ]/g, '')) * paymentData.duration).toLocaleString()}đ
                        </span>
                      </div>
                      {(() => {
                        const discounts: { [key: number]: number } = { 1: 0, 3: 0.05, 6: 0.10, 12: 0.20 };
                        const discount = discounts[paymentData.duration] || 0;
                        if (discount > 0) {
                          return (
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-green-600">Giảm giá ({discount * 100}%)</span>
                              <span className="text-green-600 font-semibold">
                                -{(parseInt(selectedCourse.price.replace(/[.,đ]/g, '')) * paymentData.duration * discount).toLocaleString()}đ
                              </span>
                            </div>
                          );
                        }
                        return null;
                      })()}
                      {paymentData.autoRenew && (
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-green-600">Gia hạn tự động (10%)</span>
                          <span className="text-green-600 font-semibold">
                            -{(calculateTotalPrice() * 0.1).toLocaleString()}đ
                          </span>
                        </div>
                      )}
                      <div className="border-t border-blue-200 pt-2 mt-2">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-gray-900">Tổng thanh toán</span>
                          <span className="text-2xl font-bold text-blue-600">
                            {Math.round(calculateTotalPrice() * (paymentData.autoRenew ? 0.9 : 1)).toLocaleString()}đ
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center gap-3 mt-6 pt-6 border-t">
                <button
                  type="button"
                  onClick={closeRegisterModal}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-lg hover:opacity-90 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <CreditCard className="size-5" />
                  Đăng ký & Thanh toán
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && selectedCourse && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-700 to-blue-900 text-white p-6 rounded-t-2xl">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl mb-2">Thanh toán khóa học</h3>
                  <p className="text-blue-100 text-sm">Chọn gói thời hạn và phương thức thanh toán</p>
                </div>
                <button
                  onClick={() => {
                    setShowPaymentModal(false);
                    setPaymentData({ duration: 1, autoRenew: false, paymentMethod: 'bank' });
                  }}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="size-5" />
                </button>
              </div>
              
              {/* Course Info */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{selectedCourse.emoji}</div>
                  <div className="flex-1">
                    <div className="font-semibold text-lg">{selectedCourse.name}</div>
                    <div className="text-blue-100 text-sm">{formData.fullName} • {formData.email}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Duration Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Chọn thời hạn gói học <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { months: 1, discount: 0, label: '1 tháng', badge: '' },
                    { months: 3, discount: 5, label: '3 tháng', badge: 'Tiết kiệm 5%' },
                    { months: 6, discount: 10, label: '6 tháng', badge: 'Tiết kiệm 10%' },
                    { months: 12, discount: 20, label: '12 tháng', badge: 'Tiết kiệm 20%' }
                  ].map((option) => {
                    const basePrice = parseInt(selectedCourse.price.replace(/[.,đ]/g, ''));
                    const totalBeforeDiscount = basePrice * option.months;
                    const totalAfterDiscount = Math.round(totalBeforeDiscount * (1 - option.discount / 100));
                    const isSelected = paymentData.duration === option.months;
                    
                    return (
                      <button
                        key={option.months}
                        type="button"
                        onClick={() => setPaymentData(prev => ({ ...prev, duration: option.months }))}
                        className={`relative p-4 border-2 rounded-xl transition-all text-left ${
                          isSelected 
                            ? 'border-blue-600 bg-blue-50 shadow-md' 
                            : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                        }`}
                      >
                        {option.badge && (
                          <div className="absolute -top-2 right-2 px-2 py-0.5 bg-orange-500 text-white text-xs rounded-full">
                            {option.badge}
                          </div>
                        )}
                        <div className={`font-semibold mb-1 ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                          {option.label}
                        </div>
                        <div className={`text-sm ${isSelected ? 'text-blue-700' : 'text-gray-600'}`}>
                          {totalAfterDiscount.toLocaleString()}đ
                        </div>
                        {option.discount > 0 && (
                          <div className="text-xs text-gray-400 line-through mt-0.5">
                            {totalBeforeDiscount.toLocaleString()}đ
                          </div>
                        )}
                        {isSelected && (
                          <div className="absolute top-2 right-2">
                            <Check className="size-5 text-blue-600" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Auto Renew */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={paymentData.autoRenew}
                    onChange={(e) => setPaymentData(prev => ({ ...prev, autoRenew: e.target.checked }))}
                    className="mt-1 w-5 h-5 text-blue-700 border-gray-300 rounded focus:ring-blue-600"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 mb-1">Gia hạn tự động</div>
                    <div className="text-sm text-gray-600">
                      Tự động gia hạn gói học khi hết hạn để không bỏ lỡ quá trình học tập
                    </div>
                  </div>
                  {paymentData.autoRenew && (
                    <div className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                      Đã bật
                    </div>
                  )}
                </label>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Phương thức thanh toán <span className="text-red-500">*</span>
                </label>
                <div className="space-y-3">
                  {/* Credit Card */}
                  <button
                    type="button"
                    onClick={() => setPaymentData(prev => ({ ...prev, paymentMethod: 'card' }))}
                    className={`w-full p-4 border-2 rounded-xl transition-all text-left flex items-center gap-4 ${
                      paymentData.paymentMethod === 'card'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      paymentData.paymentMethod === 'card' ? 'bg-blue-600' : 'bg-gray-200'
                    }`}>
                      <CreditCard className={`size-6 ${
                        paymentData.paymentMethod === 'card' ? 'text-white' : 'text-gray-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">Thẻ tín dụng / Ghi nợ</div>
                      <div className="text-sm text-gray-600">Visa, Mastercard, JCB</div>
                    </div>
                    {paymentData.paymentMethod === 'card' && (
                      <Check className="size-6 text-blue-600" />
                    )}
                  </button>

                  {/* MoMo */}
                  <button
                    type="button"
                    onClick={() => setPaymentData(prev => ({ ...prev, paymentMethod: 'momo' }))}
                    className={`w-full p-4 border-2 rounded-xl transition-all text-left flex items-center gap-4 ${
                      paymentData.paymentMethod === 'momo'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      paymentData.paymentMethod === 'momo' ? 'bg-orange-600' : 'bg-gray-200'
                    }`}>
                      <Wallet className={`size-6 ${
                        paymentData.paymentMethod === 'momo' ? 'text-white' : 'text-gray-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">Ví MoMo</div>
                      <div className="text-sm text-gray-600">Thanh toán qua ví điện tử MoMo</div>
                    </div>
                    {paymentData.paymentMethod === 'momo' && (
                      <Check className="size-6 text-blue-600" />
                    )}
                  </button>

                  {/* Bank Transfer */}
                  <button
                    type="button"
                    onClick={() => setPaymentData(prev => ({ ...prev, paymentMethod: 'bank' }))}
                    className={`w-full p-4 border-2 rounded-xl transition-all text-left flex items-center gap-4 ${
                      paymentData.paymentMethod === 'bank'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      paymentData.paymentMethod === 'bank' ? 'bg-green-600' : 'bg-gray-200'
                    }`}>
                      <Building2 className={`size-6 ${
                        paymentData.paymentMethod === 'bank' ? 'text-white' : 'text-gray-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">Chuyển khoản ngân hàng</div>
                      <div className="text-sm text-gray-600">Chuyển khoản trực tiếp qua ngân hàng</div>
                    </div>
                    {paymentData.paymentMethod === 'bank' && (
                      <Check className="size-6 text-blue-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <DollarSign className="size-5 text-blue-600" />
                  Tóm tắt đơn hàng
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Khóa học</span>
                    <span className="font-medium text-gray-900">{selectedCourse.name}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Giá gốc (1 tháng)</span>
                    <span className="font-medium text-gray-900">{selectedCourse.price}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Thời hạn</span>
                    <span className="font-medium text-gray-900">{paymentData.duration} tháng</span>
                  </div>
                  {paymentData.duration > 1 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Giảm giá</span>
                      <span className="font-medium text-green-600">
                        -{paymentData.duration === 3 ? '5%' : paymentData.duration === 6 ? '10%' : '20%'}
                      </span>
                    </div>
                  )}
                  <div className="border-t border-blue-200 pt-3 flex items-center justify-between">
                    <span className="font-semibold text-gray-900">Tổng cộng</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {calculateTotalPrice().toLocaleString()}đ
                    </span>
                  </div>
                </div>
              </div>

              {/* Security Notice */}
              <div className="flex items-start gap-3 text-sm text-gray-600 bg-gray-50 rounded-lg p-4">
                <Shield className="size-5 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-gray-900 mb-1">Thanh toán an toàn & bảo mật</div>
                  <div>Thông tin thanh toán của bạn được mã hóa và bảo vệ bởi chuẩn PCI DSS</div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t p-6 rounded-b-2xl">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowPaymentModal(false);
                    setShowRegisterModal(true);
                  }}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
                >
                  Quay lại
                </button>
                <button
                  type="button"
                  onClick={handlePayment}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-lg hover:opacity-90 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <Check className="size-5" />
                  Xác nhận thanh toán
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Free Trial Modal */}
      {showFreeTrialModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-red-500 px-8 py-6 flex items-center justify-between z-10 rounded-t-3xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Trophy className="size-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Gói Miễn Phí VSTEPRO</h3>
                  <p className="text-sm text-white/90">Trải nghiệm đầy đủ trước khi nâng cấp</p>
                </div>
              </div>
              <button
                onClick={() => setShowFreeTrialModal(false)}
                className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
              >
                <X className="size-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 rounded-full text-sm font-medium mb-6">
                <Sparkles className="size-4" />
                Miễn phí 100% - Không cần thẻ tín dụng
              </div>

              {/* Description */}
              <p className="text-gray-600 mb-8 leading-relaxed">
                Gói miễn phí được thiết kế để bạn trải nghiệm các tính năng chính của hệ thống trước khi nâng cấp lên gói đầy đủ. Bắt đầu ngay hôm nay và khám phá sức mạnh của VSTEPRO!
              </p>

              {/* Features Grid */}
              <div className="space-y-4 mb-8">
                {/* Mock Test */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border-2 border-blue-200">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <FileText className="size-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-lg font-bold text-gray-900">3 bài Mock Test</h4>
                        <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full font-medium">Miễn phí</span>
                      </div>
                      <p className="text-sm text-gray-700">
                        Truy cập 3 bài thi thử hoàn chỉnh với chấm điểm tự động cho Reading và Listening
                      </p>
                    </div>
                  </div>
                </div>

                {/* AI Speaking */}
                <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-2xl p-6 border-2 border-cyan-200">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Mic className="size-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-lg font-bold text-gray-900">1/ngày AI Speaking</h4>
                        <span className="px-2 py-0.5 bg-cyan-500 text-white text-xs rounded-full font-medium">Hằng ngày</span>
                      </div>
                      <p className="text-sm text-gray-700">
                        Luyện Speaking với AI và nhận feedback chi tiết về phát âm, ngữ pháp, từ vựng mỗi ngày
                      </p>
                    </div>
                  </div>
                </div>

                {/* AI Writing */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border-2 border-green-200">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <PenTool className="size-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-lg font-bold text-gray-900">1/ngày AI Writing</h4>
                        <span className="px-2 py-0.5 bg-green-500 text-white text-xs rounded-full font-medium">Hằng ngày</span>
                      </div>
                      <p className="text-sm text-gray-700">
                        Chấm bài Writing tự động với AI và nhận feedback cải thiện về cấu trúc, ý tưởng, từ vựng
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Benefits List */}
              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Award className="size-5 text-orange-500" />
                  Lợi ích của gói miễn phí
                </h4>
                <div className="space-y-3">
                  {[
                    'Trải nghiệm đầy đủ các tính năng chính của VSTEPRO',
                    'Chấm điểm tự động với thuật toán AI tiên tiến',
                    'Feedback chi tiết giúp cải thiện kỹ năng nhanh chóng',
                    'Không giới hạn thời gian sử dụng',
                    'Không cần cung cấp thông tin thanh toán'
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Check className="size-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Goal */}
              <div className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 rounded-xl p-6 mb-8">
                <div className="flex items-start gap-3">
                  <Target className="size-6 text-orange-600 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">💡 Mục tiêu</h4>
                    <p className="text-sm text-gray-700">
                      Gói miễn phí giúp thu hút người dùng mới, cho phép họ trải nghiệm đầy đủ các tính năng chính của VSTEPRO trước khi quyết định nâng cấp lên gói Premium để học tập không giới hạn.
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setShowFreeTrialModal(false);
                    setShowFreeRegisterModal(true);
                  }}
                  className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all shadow-lg hover:shadow-xl font-semibold text-lg flex items-center justify-center gap-2"
                >
                  <Trophy className="size-6" />
                  Bắt đầu miễn phí ngay
                  <ArrowRight className="size-6" />
                </button>

                <button
                  onClick={() => setShowFreeTrialModal(false)}
                  className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-medium"
                >
                  Để sau
                </button>
              </div>

              {/* Footer note */}
              <p className="text-center text-xs text-gray-500 mt-6">
                Bạn có thể nâng cấp lên gói Premium bất cứ lúc nào để mở khóa toàn bộ tính năng
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Free Registration Modal */}
      {showFreeRegisterModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5 flex items-center justify-between z-10 rounded-t-3xl">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Users className="size-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Đăng ký miễn phí</h3>
                  <p className="text-sm text-white/90">Tạo tài khoản để bắt đầu</p>
                </div>
              </div>
              <button
                onClick={() => setShowFreeRegisterModal(false)}
                className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleFreeRegisterSubmit} className="p-6 space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={freeRegisterData.fullName}
                  onChange={(e) => setFreeRegisterData(prev => ({ ...prev, fullName: e.target.value }))}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                    freeRegisterErrors.fullName
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-blue-600'
                  }`}
                  placeholder="Nguyễn Văn A"
                />
                {freeRegisterErrors.fullName && (
                  <p className="text-red-500 text-xs mt-1">{freeRegisterErrors.fullName}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={freeRegisterData.email}
                  onChange={(e) => setFreeRegisterData(prev => ({ ...prev, email: e.target.value }))}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                    freeRegisterErrors.email
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-blue-600'
                  }`}
                  placeholder="email@example.com"
                />
                {freeRegisterErrors.email && (
                  <p className="text-red-500 text-xs mt-1">{freeRegisterErrors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={freeRegisterData.phone}
                  onChange={(e) => setFreeRegisterData(prev => ({ ...prev, phone: e.target.value }))}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                    freeRegisterErrors.phone
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-blue-600'
                  }`}
                  placeholder="0912345678"
                />
                {freeRegisterErrors.phone && (
                  <p className="text-red-500 text-xs mt-1">{freeRegisterErrors.phone}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Mật khẩu <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={freeRegisterData.password}
                  onChange={(e) => setFreeRegisterData(prev => ({ ...prev, password: e.target.value }))}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                    freeRegisterErrors.password
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-blue-600'
                  }`}
                  placeholder="Tối thiểu 6 ký tự"
                />
                {freeRegisterErrors.password && (
                  <p className="text-red-500 text-xs mt-1">{freeRegisterErrors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Xác nhận mật khẩu <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={freeRegisterData.confirmPassword}
                  onChange={(e) => setFreeRegisterData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                    freeRegisterErrors.confirmPassword
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-blue-600'
                  }`}
                  placeholder="Nhập lại mật khẩu"
                />
                {freeRegisterErrors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">{freeRegisterErrors.confirmPassword}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg font-semibold mt-6"
              >
                Đăng ký ngay
              </button>

              {/* Footer */}
              <p className="text-center text-xs text-gray-500 mt-4">
                Bằng việc đăng ký, bạn đồng ý với <span className="text-blue-600">Điều khoản</span> và <span className="text-blue-600">Chính sách</span> của chúng tôi
              </p>
            </form>
          </div>
        </div>
      )}

      {/* Email Verification Modal */}
      {showEmailVerifyModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-5 flex items-center justify-between rounded-t-3xl">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Mail className="size-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Xác thực Email</h3>
                  <p className="text-sm text-white/90">Nhập mã OTP đã gửi</p>
                </div>
              </div>
              <button
                onClick={() => setShowEmailVerifyModal(false)}
                className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Success Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <Mail className="size-10 text-green-600" />
                </div>
              </div>

              {/* Message */}
              <div className="text-center mb-6">
                <h4 className="font-semibold text-gray-900 mb-2">Email đã được gửi!</h4>
                <p className="text-sm text-gray-600">
                  Chúng tôi đã gửi mã OTP 6 chữ số đến email <span className="font-medium text-blue-600">{freeRegisterData.email}</span>
                </p>
              </div>

              {/* OTP Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
                  Nhập mã OTP
                </label>
                <input
                  type="text"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-center text-2xl tracking-widest font-semibold"
                  placeholder="000000"
                  maxLength={6}
                />
                <p className="text-xs text-gray-500 text-center mt-2">
                  Demo: Nhập <span className="font-semibold text-green-600">123456</span> để xác thực
                </p>
              </div>

              {/* Verify Button */}
              <button
                onClick={handleVerifyOTP}
                className="w-full py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-md hover:shadow-lg font-semibold"
              >
                Xác thực
              </button>

              {/* Resend */}
              <div className="text-center mt-4">
                <button className="text-sm text-blue-600 hover:underline">
                  Gửi lại mã OTP
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5 flex items-center justify-between rounded-t-3xl">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Shield className="size-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Đăng nhập</h3>
                  <p className="text-sm text-white/90">Truy cập tài khoản của bạn</p>
                </div>
              </div>
              <button
                onClick={() => setShowLoginModal(false)}
                className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleLoginSubmit} className="p-6 space-y-4">
              {/* Success Message */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-2">
                  <Check className="size-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-900">Tài khoản đã được kích hoạt!</p>
                    <p className="text-xs text-green-700 mt-1">Đăng nhập để bắt đầu sử dụng gói miễn phí.</p>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={loginData.email}
                  onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                    loginErrors.email
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-blue-600'
                  }`}
                  placeholder="Demo: test@gmail.com"
                />
                {loginErrors.email && (
                  <p className="text-red-500 text-xs mt-1">{loginErrors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Mật khẩu <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                    loginErrors.password
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-blue-600'
                  }`}
                  placeholder="Demo: nhập gì cũng được"
                />
                {loginErrors.password && (
                  <p className="text-red-500 text-xs mt-1">{loginErrors.password}</p>
                )}
              </div>

              {/* Forgot Password */}
              <div className="text-right">
                <button type="button" className="text-sm text-blue-600 hover:underline">
                  Quên mật khẩu?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg font-semibold mt-6"
              >
                Đăng nhập
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
