import { NextRequest, NextResponse } from 'next/server';
import { dashboardClient } from '@/lib/interweb-client';

export async function POST(
  request: NextRequest,
  { params }: { params: { operator: string } }
) {
  try {
    const config = await request.json().catch(() => ({}));
    await dashboardClient.installOperator(params.operator, config);
    
    return NextResponse.json({ 
      success: true,
      message: `Operator ${params.operator} installation initiated`
    });
  } catch (error) {
    console.error('Failed to install operator:', error);
    return NextResponse.json(
      { 
        error: 'Failed to install operator',
        message: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { operator: string } }
) {
  try {
    await dashboardClient.uninstallOperator(params.operator);
    
    return NextResponse.json({ 
      success: true,
      message: `Operator ${params.operator} uninstallation initiated`
    });
  } catch (error) {
    console.error('Failed to uninstall operator:', error);
    return NextResponse.json(
      { 
        error: 'Failed to uninstall operator',
        message: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}
