import { companyConfig } from '@/config/company';
import { Building2, MapPin } from 'lucide-react';

export function OfficeLocations() {
  return (
    <div className="space-y-6">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Office Locations
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Corporate Headquarters */}
        <div className="rounded-xl border border-border bg-card p-5 space-y-2">
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
            <Building2 className="h-4 w-4" />
            Corporate Headquarters
          </div>
          <p className="font-semibold text-foreground text-sm">{companyConfig.name}</p>
          <div className="text-sm text-muted-foreground space-y-0.5">
            <p>{companyConfig.address.street}</p>
            <p>{companyConfig.address.landmark}</p>
            <p>
              {companyConfig.address.locality}, {companyConfig.address.city} – {companyConfig.address.postalCode}
            </p>
            <p>{companyConfig.address.country}</p>
          </div>
        </div>

        {/* Branch Office */}
        <div className="rounded-xl border border-border bg-card p-5 space-y-2">
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
            <MapPin className="h-4 w-4" />
            Branch Office
          </div>
          <p className="font-semibold text-foreground text-sm">{companyConfig.branchOffice.building}</p>
          <div className="text-sm text-muted-foreground space-y-0.5">
            <p>{companyConfig.branchOffice.street}</p>
            <p>{companyConfig.branchOffice.landmark}</p>
            <p>
              {companyConfig.branchOffice.locality}, {companyConfig.branchOffice.city} – {companyConfig.branchOffice.postalCode}
            </p>
            <p>{companyConfig.branchOffice.state}, {companyConfig.branchOffice.country}</p>
          </div>
        </div>
      </div>
    </div>
  );
}