import type { UseCase } from '../../types';

interface UseCasesProps {
  useCases: UseCase[];
}

export function UseCases({ useCases }: UseCasesProps) {
  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12">Use Cases</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {useCases.map((useCase) => (
            <div key={useCase.id} className="rounded-lg border border-border p-6">
              <h3 className="text-lg font-semibold mb-2">{useCase.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">{useCase.description}</p>
              <span className="text-xs font-medium text-primary">{useCase.industry}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}