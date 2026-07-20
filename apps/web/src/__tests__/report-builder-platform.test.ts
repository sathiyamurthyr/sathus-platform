import {
  mockReportTemplates,
  mockSavedReports,
  mockReportExecutionHistory,
} from '../features/analytics/data/mock-reporting-data';

describe('Story 14.3 Enterprise Report Builder & Scheduled Reporting Verification', () => {
  it('validates built-in enterprise report templates gallery', () => {
    expect(mockReportTemplates.length).toBeGreaterThan(0);
    mockReportTemplates.forEach((tmpl) => {
      expect(tmpl.id).toBeTruthy();
      expect(tmpl.title).toBeTruthy();
      expect(tmpl.category).toBeTruthy();
      expect(tmpl.defaultFormat).toBeTruthy();
      expect(tmpl.isBuiltIn).toBe(true);
    });
  });

  it('validates report definitions and widget layout configuration', () => {
    expect(mockSavedReports.length).toBeGreaterThan(0);
    mockSavedReports.forEach((rpt) => {
      expect(rpt.id).toBeTruthy();
      expect(rpt.title).toBeTruthy();
      expect(rpt.owner).toBeTruthy();
      expect(rpt.version).toBeTruthy();
      expect(rpt.widgets.length).toBeGreaterThan(0);
    });
  });

  it('validates automated cron schedule configuration and timezone settings', () => {
    const scheduledReport = mockSavedReports.find((r) => r.schedule);
    expect(scheduledReport).toBeDefined();
    if (scheduledReport && scheduledReport.schedule) {
      const sch = scheduledReport.schedule;
      expect(sch.cronExpression).toBeTruthy();
      expect(sch.timeZone).toBe('UTC');
      expect(sch.recipients.length).toBeGreaterThan(0);
      expect(sch.channels.length).toBeGreaterThan(0);
    }
  });

  it('validates report execution and delivery audit log', () => {
    expect(mockReportExecutionHistory.length).toBeGreaterThan(0);
    mockReportExecutionHistory.forEach((hist) => {
      expect(hist.reportId).toBeTruthy();
      expect(hist.status).toBe('success');
      expect(hist.fileSizeBytes).toBeGreaterThan(0);
      expect(hist.downloadUrl).toBeTruthy();
    });
  });
});
