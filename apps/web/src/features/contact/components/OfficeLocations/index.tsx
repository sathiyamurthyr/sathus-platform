export function OfficeLocations() {
  return (
    <div>
      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
        Office Locations
      </h3>
      <div className="space-y-3">
        <div>
          <p className="font-medium">San Francisco</p>
          <p className="text-sm text-muted-foreground">
            123 Market Street, Suite 1000
          </p>
          <p className="text-sm text-muted-foreground">CA 94105, United States</p>
        </div>
        <div>
          <p className="font-medium">New York</p>
          <p className="text-sm text-muted-foreground">
            456 Park Avenue, Floor 12
          </p>
          <p className="text-sm text-muted-foreground">NY 10022, United States</p>
        </div>
        <div>
          <p className="font-medium">London</p>
          <p className="text-sm text-muted-foreground">
            789 Oxford Street, 3rd Floor
          </p>
          <p className="text-sm text-muted-foreground">W1D 2EP, United Kingdom</p>
        </div>
      </div>
    </div>
  );
}