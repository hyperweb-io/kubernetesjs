import React from 'react';

import { render, screen } from '@/__tests__/utils/test-utils';
import SettingsPage from '@/app/d/settings/page';

describe('Settings Page', () => {
  it('should render the settings page', () => {
    render(<SettingsPage />);
    
    // Check main title
    expect(screen.getByText('Settings')).toBeInTheDocument();
    
    // Check description
    expect(screen.getByText(/Configure your Smart Objects dashboard preferences and integrations/)).toBeInTheDocument();
  });

  it('should render profile settings section', () => {
    render(<SettingsPage />);
    
    // Check section title
    expect(screen.getByText('Profile Settings')).toBeInTheDocument();
    
    // Check description
    expect(screen.getByText(/Manage your user profile and preferences/)).toBeInTheDocument();
    
    // Check placeholder content
    expect(screen.getByText(/Profile management interface coming soon/)).toBeInTheDocument();
  });

  it('should render API keys section', () => {
    render(<SettingsPage />);
    
    // Check section title
    expect(screen.getByText('API Keys & Integrations')).toBeInTheDocument();
    
    // Check description
    expect(screen.getByText(/Manage API keys and external service integrations/)).toBeInTheDocument();
    
    // Check placeholder content
    expect(screen.getByText(/API key management interface coming soon/)).toBeInTheDocument();
  });

  it('should render notifications section', () => {
    render(<SettingsPage />);
    
    // Check section title
    expect(screen.getByText('Notifications')).toBeInTheDocument();
    
    // Check description
    expect(screen.getByText(/Configure alerts and notification preferences/)).toBeInTheDocument();
    
    // Check placeholder content
    expect(screen.getByText(/Notification settings interface coming soon/)).toBeInTheDocument();
  });

  it('should render security section', () => {
    render(<SettingsPage />);
    
    // Check section title
    expect(screen.getByText('Security')).toBeInTheDocument();
    
    // Check description
    expect(screen.getByText(/Security settings and access control/)).toBeInTheDocument();
    
    // Check placeholder content
    expect(screen.getByText(/Security settings interface coming soon/)).toBeInTheDocument();
  });
});

