# FE-027: Certificate Download Page

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | FE-027 |
| **Phase** | 1 - MVP |
| **Sprint** | 5-6 |
| **Priority** | P2 (Medium) |
| **Estimated Hours** | 4h |
| **Dependencies** | FE-026, BE-027 |

---

## ⚠️ QUAN TRỌNG - Đọc trước khi implement

> **Existing files:**
> - Certificate component chưa có - **CÓ THỂ TẠO MỚI**

**Action:**
- ✅ CREATE `components/exam/CertificateDownload.tsx`
- ✅ CREATE page `app/(dashboard)/certificates/[id]/page.tsx`
- ✅ INTEGRATE với BE-027 Certificate API
- ✅ ADD PDF generation và download

---

## 🎯 Objective

Implement Certificate Download Page với:
- Certificate preview display
- PDF download functionality
- QR verification display
- Social sharing options
- Print support

---

## 💻 Implementation

### Step 1: Certificate Page

```tsx
// src/app/(main)/exams/[attemptId]/certificate/page.tsx
'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { examService } from '@/services/examService';
import { CertificatePreview } from '@/features/certificate/CertificatePreview';
import { CertificateActions } from '@/features/certificate/CertificateActions';
import { CertificateInfo } from '@/features/certificate/CertificateInfo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/useToast';
import { AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';

export default function CertificatePage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const attemptId = params.attemptId as string;

  const [displayName, setDisplayName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Check if certificate exists
  const {
    data: certificate,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['certificate', attemptId],
    queryFn: async () => {
      try {
        // First try to get existing certificate
        const result = await examService.results.getResult(attemptId);
        // If user has certificates, find the one for this attempt
        const certs = await examService.certificates.getAll();
        return certs.find((c) => c.certificateId.includes(attemptId)) || null;
      } catch {
        return null;
      }
    },
  });

  // Get result for eligibility check
  const { data: result, isLoading: loadingResult } = useQuery({
    queryKey: ['exam-result', attemptId],
    queryFn: () => examService.results.getResult(attemptId),
  });

  // Generate certificate mutation
  const generateMutation = useMutation({
    mutationFn: async () => {
      setIsGenerating(true);
      return examService.certificates.generate(attemptId, displayName || undefined);
    },
    onSuccess: () => {
      refetch();
      toast({
        title: 'Certificate Generated',
        description: 'Your certificate has been created successfully!',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Generation Failed',
        description: error.message || 'Could not generate certificate',
        variant: 'destructive',
      });
    },
    onSettled: () => {
      setIsGenerating(false);
    },
  });

  const isEligible = result && result.vstepScore >= 4.0;

  if (isLoading || loadingResult) {
    return <CertificatePageSkeleton />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load certificate data. Please try again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.push(`/exams/${attemptId}/result`)}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Results
        </Button>

        {certificate ? (
          // Certificate exists - show preview and actions
          <div className="space-y-8">
            <CertificatePreview certificate={certificate} />
            <CertificateInfo certificate={certificate} />
            <CertificateActions certificate={certificate} />
          </div>
        ) : isEligible ? (
          // Eligible but no certificate - show generation form
          <div className="max-w-lg mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">🎓</span>
                </div>
                <h1 className="text-2xl font-bold mb-2">
                  Congratulations!
                </h1>
                <p className="text-gray-600">
                  You scored {result.vstepScore.toFixed(1)}/10 and are eligible
                  for a VSTEP certificate!
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <Label htmlFor="displayName">Name on Certificate</Label>
                  <Input
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Enter your full name"
                    className="mt-2"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    This name will appear on your certificate
                  </p>
                </div>

                <Button
                  onClick={() => generateMutation.mutate()}
                  disabled={isGenerating}
                  className="w-full gap-2"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generating Certificate...
                    </>
                  ) : (
                    'Generate My Certificate'
                  )}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          // Not eligible
          <div className="max-w-lg mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">📊</span>
              </div>
              <h1 className="text-2xl font-bold mb-2">Not Eligible Yet</h1>
              <p className="text-gray-600 mb-6">
                A minimum score of 4.0/10 is required to receive a certificate.
                Your score: {result?.vstepScore.toFixed(1) || 'N/A'}/10
              </p>
              <Button onClick={() => router.push('/exams')} className="gap-2">
                Try Another Exam
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CertificatePageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton className="h-8 w-32 mb-6" />
      <div className="max-w-3xl mx-auto">
        <Skeleton className="h-[500px] w-full rounded-xl" />
      </div>
    </div>
  );
}
```

### Step 2: Certificate Preview Component

```tsx
// src/features/certificate/CertificatePreview.tsx
'use client';

import { Certificate } from '@/types/exam';
import { cn } from '@/lib/utils';
import { Award, Shield } from 'lucide-react';
import Image from 'next/image';

interface CertificatePreviewProps {
  certificate: Certificate;
  className?: string;
}

export function CertificatePreview({
  certificate,
  className,
}: CertificatePreviewProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-2xl shadow-2xl overflow-hidden max-w-4xl mx-auto',
        className
      )}
    >
      {/* Certificate Frame */}
      <div className="relative aspect-[1.414/1] p-8 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        {/* Border Decoration */}
        <div className="absolute inset-4 border-4 border-double border-blue-200 rounded-lg" />
        <div className="absolute inset-6 border-2 border-blue-100 rounded-lg" />

        {/* Content */}
        <div className="relative h-full flex flex-col items-center justify-between py-8 px-12">
          {/* Header */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Shield className="w-8 h-8 text-blue-600" />
              <h1 className="text-lg font-semibold text-blue-600 tracking-wider uppercase">
                VSTEPro
              </h1>
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-3xl font-serif font-bold text-gray-800 tracking-wide">
              Certificate of Achievement
            </h2>
          </div>

          {/* Main Content */}
          <div className="text-center flex-1 flex flex-col justify-center">
            <p className="text-gray-600 mb-2">This is to certify that</p>
            <h3 className="text-4xl font-serif font-bold text-blue-900 mb-4">
              {certificate.recipientName}
            </h3>
            <p className="text-gray-600 mb-6">
              has successfully completed the
            </p>
            <h4 className="text-2xl font-semibold text-gray-800 mb-6">
              {certificate.examTitle}
            </h4>

            {/* Score Badge */}
            <div className="flex items-center justify-center gap-8 mb-4">
              <div className="text-center">
                <div className="w-24 h-24 rounded-full border-4 border-blue-500 flex items-center justify-center bg-white shadow-lg">
                  <div>
                    <p className="text-3xl font-bold text-blue-600">
                      {certificate.vstepScore.toFixed(1)}
                    </p>
                    <p className="text-xs text-gray-500">/10</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2">VSTEP Score</p>
              </div>

              <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                  <div className="text-white">
                    <Award className="w-8 h-8 mx-auto mb-1" />
                    <p className="text-xl font-bold">{certificate.band}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2">CEFR Band</p>
              </div>
            </div>

            {/* Skill Scores */}
            <div className="flex justify-center gap-6 text-sm">
              {certificate.skillScores.map((skill) => (
                <div key={skill.skill} className="text-center">
                  <p className="font-semibold text-gray-800">
                    {skill.score.toFixed(1)}
                  </p>
                  <p className="text-gray-500 capitalize">{skill.skill}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-end justify-between w-full">
            {/* QR Code */}
            <div className="text-center">
              {certificate.qrCodeUrl && (
                <Image
                  src={certificate.qrCodeUrl}
                  alt="Verification QR Code"
                  width={80}
                  height={80}
                  className="bg-white p-1 rounded"
                />
              )}
              <p className="text-xs text-gray-500 mt-1">Scan to verify</p>
            </div>

            {/* Certificate Info */}
            <div className="text-center">
              <div className="w-32 border-b-2 border-gray-400 mb-2" />
              <p className="text-sm text-gray-600">VSTEPro Team</p>
            </div>

            {/* Date & Number */}
            <div className="text-right text-sm">
              <p className="text-gray-600">
                <span className="font-medium">Issue Date:</span>{' '}
                {new Date(certificate.issueDate).toLocaleDateString()}
              </p>
              <p className="text-gray-500 text-xs mt-1">
                No: {certificate.certificateNumber}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### Step 3: Certificate Actions Component

```tsx
// src/features/certificate/CertificateActions.tsx
'use client';

import { useState } from 'react';
import { Certificate } from '@/types/exam';
import { examService } from '@/services/examService';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/useToast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Download,
  Share2,
  Printer,
  Copy,
  Check,
  Linkedin,
  Facebook,
  Twitter,
} from 'lucide-react';

interface CertificateActionsProps {
  certificate: Certificate;
}

export function CertificateActions({ certificate }: CertificateActionsProps) {
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const blob = await examService.certificates.download(certificate.certificateId);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `VSTEP-Certificate-${certificate.certificateNumber}.pdf`;
      a.click();
      URL.revokeObjectURL(url);

      toast({
        title: 'Download Started',
        description: 'Your certificate is being downloaded.',
      });
    } catch (error) {
      toast({
        title: 'Download Failed',
        description: 'Could not download certificate. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(certificate.verificationUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const shareText = `I just earned my VSTEP Certificate with a score of ${certificate.vstepScore}/10 (${certificate.band})! 🎓`;
  const shareUrl = certificate.verificationUrl;

  const socialLinks = {
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
  };

  return (
    <div className="flex flex-wrap justify-center gap-4 print:hidden">
      {/* Download PDF */}
      <Button
        onClick={handleDownload}
        disabled={isDownloading}
        className="gap-2"
        size="lg"
      >
        <Download className="w-5 h-5" />
        {isDownloading ? 'Downloading...' : 'Download PDF'}
      </Button>

      {/* Print */}
      <Button variant="outline" onClick={handlePrint} className="gap-2" size="lg">
        <Printer className="w-5 h-5" />
        Print
      </Button>

      {/* Share */}
      <Button
        variant="outline"
        onClick={() => setIsShareOpen(true)}
        className="gap-2"
        size="lg"
      >
        <Share2 className="w-5 h-5" />
        Share
      </Button>

      {/* Share Dialog */}
      <Dialog open={isShareOpen} onOpenChange={setIsShareOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Your Achievement</DialogTitle>
            <DialogDescription>
              Share your certificate with the world!
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Verification Link */}
            <div>
              <p className="text-sm text-gray-500 mb-2">Verification Link</p>
              <div className="flex gap-2">
                <Input value={certificate.verificationUrl} readOnly />
                <Button onClick={handleCopyLink} className="gap-2">
                  {isCopied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Social Share */}
            <div>
              <p className="text-sm text-gray-500 mb-3">Share on Social Media</p>
              <div className="flex justify-center gap-4">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => window.open(socialLinks.linkedin, '_blank')}
                  className="gap-2"
                >
                  <Linkedin className="w-5 h-5 text-[#0077b5]" />
                  LinkedIn
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => window.open(socialLinks.facebook, '_blank')}
                  className="gap-2"
                >
                  <Facebook className="w-5 h-5 text-[#1877f2]" />
                  Facebook
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => window.open(socialLinks.twitter, '_blank')}
                  className="gap-2"
                >
                  <Twitter className="w-5 h-5 text-[#1da1f2]" />
                  Twitter
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsShareOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
```

### Step 4: Certificate Info Component

```tsx
// src/features/certificate/CertificateInfo.tsx
'use client';

import { Certificate } from '@/types/exam';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Shield, Hash } from 'lucide-react';
import { formatDate } from '@/utils/date';

interface CertificateInfoProps {
  certificate: Certificate;
}

export function CertificateInfo({ certificate }: CertificateInfoProps) {
  const isExpired = new Date(certificate.expiryDate) < new Date();

  return (
    <div className="max-w-4xl mx-auto print:hidden">
      <Card>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-4 gap-6">
            {/* Certificate Number */}
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Hash className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Certificate Number</p>
                <p className="font-mono font-medium">
                  {certificate.certificateNumber}
                </p>
              </div>
            </div>

            {/* Issue Date */}
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <Calendar className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Issue Date</p>
                <p className="font-medium">
                  {formatDate(certificate.issueDate)}
                </p>
              </div>
            </div>

            {/* Expiry Date */}
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-50 rounded-lg">
                <Clock className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Valid Until</p>
                <p className="font-medium">
                  {formatDate(certificate.expiryDate)}
                </p>
                {isExpired && (
                  <Badge variant="destructive" className="mt-1">
                    Expired
                  </Badge>
                )}
              </div>
            </div>

            {/* Verification Status */}
            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Shield className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <Badge className="bg-green-500">Verified</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

### Step 5: Certificate Verification Page (Public)

```tsx
// src/app/verify/[code]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { examService } from '@/services/examService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  CheckCircle,
  XCircle,
  Calendar,
  User,
  Award,
  FileText,
  AlertTriangle,
} from 'lucide-react';
import { formatDate } from '@/utils/date';

export default function VerifyCertificatePage() {
  const params = useParams();
  const code = params.code as string;

  const { data, isLoading, error } = useQuery({
    queryKey: ['verify-certificate', code],
    queryFn: () => examService.certificates.verify(code),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8">
            <Skeleton className="h-16 w-16 rounded-full mx-auto mb-4" />
            <Skeleton className="h-6 w-48 mx-auto mb-2" />
            <Skeleton className="h-4 w-32 mx-auto" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-10 h-10 text-red-500" />
            </div>
            <h1 className="text-xl font-bold text-red-600 mb-2">
              Verification Failed
            </h1>
            <p className="text-gray-600">
              This certificate could not be verified. It may be invalid or the
              verification code is incorrect.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center pb-4">
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
              data.isValid && !data.isExpired
                ? 'bg-green-100'
                : 'bg-amber-100'
            }`}
          >
            {data.isValid && !data.isExpired ? (
              <CheckCircle className="w-12 h-12 text-green-500" />
            ) : (
              <AlertTriangle className="w-12 h-12 text-amber-500" />
            )}
          </div>
          <CardTitle
            className={
              data.isValid && !data.isExpired
                ? 'text-green-600'
                : 'text-amber-600'
            }
          >
            {data.isValid && !data.isExpired
              ? 'Certificate Verified'
              : data.isExpired
              ? 'Certificate Expired'
              : 'Invalid Certificate'}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Certificate Details */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Recipient</p>
                <p className="font-semibold">{data.recipientName}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Exam</p>
                <p className="font-semibold">{data.examTitle}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Award className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">VSTEP Score / Band</p>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-lg text-blue-600">
                    {data.vstepScore.toFixed(1)}/10
                  </span>
                  <Badge className="bg-blue-500">{data.band}</Badge>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Issue Date</p>
                <p className="font-medium">{formatDate(data.issueDate)}</p>
              </div>
            </div>
          </div>

          {/* Certificate Number */}
          <div className="text-center">
            <p className="text-sm text-gray-500">Certificate Number</p>
            <p className="font-mono font-medium">{data.certificateNumber}</p>
          </div>

          {/* Status */}
          {data.isExpired && (
            <div className="bg-amber-50 rounded-lg p-4 text-center">
              <p className="text-amber-700 text-sm">
                This certificate expired on {formatDate(data.expiryDate!)}
              </p>
            </div>
          )}

          {/* Footer */}
          <div className="text-center text-xs text-gray-400 pt-4 border-t">
            <p>Verified by VSTEPro Certification System</p>
            <p className="mt-1">
              {new Date().toLocaleString()}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

### Step 6: Print Styles

```css
/* src/styles/print.css */
@media print {
  /* Hide non-printable elements */
  .print\\:hidden,
  nav,
  header,
  footer,
  button,
  .sidebar {
    display: none !important;
  }

  /* Full page certificate */
  .certificate-preview {
    width: 100%;
    height: 100vh;
    page-break-after: always;
  }

  /* Reset backgrounds */
  body {
    background: white !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  /* Preserve colors */
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  /* Page settings */
  @page {
    size: A4 landscape;
    margin: 0;
  }
}
```

---

## ✅ Acceptance Criteria

- [ ] Certificate preview renders correctly
- [ ] PDF download works
- [ ] QR code displays and links to verification
- [ ] Verification page works for public access
- [ ] Social sharing (LinkedIn, Facebook, Twitter)
- [ ] Print layout correct
- [ ] Eligible check (score ≥ 4.0) works
- [ ] Name customization on generation
- [ ] Expired certificate shows warning

---

## 🎉 Sprint 05-06 Complete!

All 16 tasks for Sprint 05-06 (Exam Module) have been created:

**Backend (8 tasks):**
- BE-020: Exam Attempt Entity
- BE-021: Exam Timer Service
- BE-022: Exam Submission Service
- BE-023: VSTEP Full Scoring
- BE-024: Exam Analytics
- BE-025: Exam Session Management
- BE-026: Exam Result Generation
- BE-027: Exam Certificate

**Frontend (8 tasks):**
- FE-020: Exam API Service
- FE-021: Exam Selection Page
- FE-022: Exam Session Layout
- FE-023: Exam Timer Component
- FE-024: Exam Navigation
- FE-025: Exam Submission Flow
- FE-026: Exam Result Page
- FE-027: Certificate Download

→ Next: `SPRINT_07_08_DASHBOARD/` - Dashboard & Analytics Module
