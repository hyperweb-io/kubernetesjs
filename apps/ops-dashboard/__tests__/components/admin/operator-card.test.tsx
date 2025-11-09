import type { OperatorInfo } from '@kubernetesjs/client';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { OperatorCard } from '../../../components/admin/operator-card';
import { render, screen, waitFor } from '../../utils/test-utils';

// Mock useOperatorMutation to control install/uninstall behavior
const installMock = jest.fn();
const uninstallMock = jest.fn();

jest.mock('../../../hooks/use-operators', () => ({
  useOperatorMutation: () => ({
    installOperator: { mutateAsync: installMock },
    uninstallOperator: { mutateAsync: uninstallMock },
  }),
}));

const baseOperator: OperatorInfo = {
  name: 'ingress-nginx',
  displayName: 'Ingress NGINX',
  version: '1.10.0',
  description: 'Kubernetes Ingress controller for NGINX',
  status: 'not-installed',
  docsUrl: 'https://kubernetes.github.io/ingress-nginx/',
};

describe('OperatorCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders full card with title, version, description and status', () => {
    render(<OperatorCard operator={{ ...baseOperator, status: 'ready' }} />);

    expect(screen.getByRole('heading', { name: 'Ingress NGINX' })).toBeInTheDocument();
    expect(screen.getByText('v1.10.0')).toBeInTheDocument();
    expect(screen.getByText('Kubernetes Ingress controller for NGINX')).toBeInTheDocument();

    // StatusIndicator present (icon)
    expect(document.querySelector('svg.lucide')).toBeInTheDocument();
  });

  it('renders compact mode with icon, version and toggle', () => {
    render(<OperatorCard operator={baseOperator} compact />);

    expect(screen.getByText('Ingress NGINX')).toBeInTheDocument();
    expect(screen.getByText('v1.10.0')).toBeInTheDocument();

    // Has switch (role switch comes from radix; fallback query by input[type=checkbox])
    const checkbox = document.querySelector('button[role="switch"], input[type="checkbox"]');
    expect(checkbox).toBeTruthy();
  });

  it('calls install when toggled on from not-installed', async () => {
    const user = userEvent.setup();
    // Delay install to observe loading state if needed
    installMock.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 50)));

    render(<OperatorCard operator={{ ...baseOperator, status: 'not-installed' }} />);

    const switchEl = document.querySelector('button[role="switch"], input[type="checkbox"]') as HTMLElement;
    expect(switchEl).toBeTruthy();
    await user.click(switchEl);

    await waitFor(() => {
      expect(installMock).toHaveBeenCalledWith('ingress-nginx');
    });
  });

  it('calls uninstall when toggled off from installed state', async () => {
    const user = userEvent.setup();
    uninstallMock.mockResolvedValue(undefined);

    render(<OperatorCard operator={{ ...baseOperator, status: 'installed' }} />);

    const switchEl = document.querySelector('button[role="switch"], input[type="checkbox"]') as HTMLElement;
    expect(switchEl).toBeTruthy();
    await user.click(switchEl);

    await waitFor(() => {
      expect(uninstallMock).toHaveBeenCalledWith('ingress-nginx');
    });
  });

  it('shows settings button only when installed', () => {
    const { rerender } = render(<OperatorCard operator={{ ...baseOperator, status: 'not-installed' }} />);
    // Settings button is an anchor wrapped in button; look for Settings icon container
    expect(document.querySelector('a[href="/operators/ingress-nginx"]')).not.toBeInTheDocument();

    rerender(<OperatorCard operator={{ ...baseOperator, status: 'installed' }} />);
    expect(document.querySelector('a[href="/operators/ingress-nginx"]')).toBeInTheDocument();
  });

  it('renders docs link when docsUrl provided', () => {
    render(<OperatorCard operator={{ ...baseOperator, status: 'installed' }} />);
    const docs = document.querySelector(`a[href="${baseOperator.docsUrl}"]`);
    expect(docs).toBeInTheDocument();
  });
});
