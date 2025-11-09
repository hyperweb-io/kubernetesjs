import React from 'react';

import { render, screen } from '@/__tests__/utils/test-utils';
import TemplatesPage from '@/app/admin/templates/page';

// Mock the templates and components
jest.mock('@/components/templates/templates', () => ({
  templates: [
    { id: 'postgres', name: 'PostgreSQL', description: 'Test template' }
  ],
  TemplatesView: () => <div data-testid="templates-view">Templates View</div>
}));

jest.mock('@/components/admin/template-filters', () => ({
  TemplateFilters: () => <div data-testid="template-filters">Template Filters</div>
}));

jest.mock('@/components/admin/template-card', () => ({
  TemplateCard: ({ template }: any) => <div data-testid={`template-card-${template.id}`}>{template.name}</div>
}));

describe('Templates Page', () => {
  it('should render the templates page', () => {
    render(<TemplatesPage />);
    
    // Check that the page renders
    expect(screen.getByText('Templates')).toBeInTheDocument();
    expect(screen.getByText('Deploy and manage application templates')).toBeInTheDocument();
  });
});

