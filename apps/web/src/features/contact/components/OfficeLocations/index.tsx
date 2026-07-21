import { companyConfig } from '@/config/company';

export function OfficeLocations() {
  return (
    <div>
      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
        Corporate Headquarters
      </h3>
      <div className="space-y-3">
        <div>
          <p className="font-medium text-foreground">{companyConfig.name}</p>
          <p className="text-sm text-muted-foreground">{companyConfig.address.street}</p>
          <p className="text-sm text-muted-foreground">{companyConfig.address.landmark}</p>
          <p className="text-sm text-muted-foreground">
            {companyConfig.address.locality}, {companyConfig.address.city} – {companyConfig.address.postalCode}
          </p>
          <p className="text-sm text-muted-foreground">{companyConfig.address.country}</p>
        </div>
      </div>
    </div>
  );
}