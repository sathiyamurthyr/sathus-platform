export function BusinessHours() {
  return (
    <div>
      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
        Business Hours
      </h3>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-sm">Monday - Friday</span>
          <span className="text-sm font-medium">9:00 AM - 6:00 PM</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm">Saturday</span>
          <span className="text-sm font-medium">10:00 AM - 2:00 PM</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm">Sunday</span>
          <span className="text-sm font-medium">Closed</span>
        </div>
      </div>
    </div>
  );
}