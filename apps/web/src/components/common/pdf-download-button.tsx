'use client';

import * as React from 'react';
import { Download, FileCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PdfDownloadButtonProps {
  title: string;
}

export function PdfDownloadButton({ title }: PdfDownloadButtonProps) {
  const [downloading, setDownloading] = React.useState(false);

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      window.print();
      setDownloading(false);
    }, 500);
  };

  return (
    <Button
      onClick={handleDownload}
      variant="outline"
      size="sm"
      className="h-8 text-xs font-bold gap-1.5 border-primary/40 hover:bg-primary/10 transition-colors shadow-sm"
    >
      {downloading ? <FileCheck className="h-3.5 w-3.5 text-emerald-500 animate-pulse" /> : <Download className="h-3.5 w-3.5 text-primary" />}
      {downloading ? 'Preparing PDF...' : 'Download Executive PDF'}
    </Button>
  );
}
