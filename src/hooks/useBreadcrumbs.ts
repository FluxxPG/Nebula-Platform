import { useState, useCallback } from 'react';
import { BreadcrumbItem } from '../components/BreadcrumbNavigation';

export interface BreadcrumbConfig {
  id: string;
  label: string;
  icon?: React.ReactNode;
  path?: string;
}

export const useBreadcrumbs = () => {
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);

  const updateBreadcrumbs = useCallback((newBreadcrumbs: BreadcrumbConfig[], onNavigate?: (id: string) => void) => {
    const breadcrumbItems: BreadcrumbItem[] = newBreadcrumbs.map((crumb, index) => ({
      id: crumb.id,
      label: crumb.label,
      icon: crumb.icon,
      isActive: index === newBreadcrumbs.length - 1,
      onClick: index < newBreadcrumbs.length - 1 ? () => onNavigate?.(crumb.id) : undefined,
    }));
    
    setBreadcrumbs(breadcrumbItems);
  }, []);

  const addBreadcrumb = useCallback((breadcrumb: BreadcrumbConfig, onNavigate?: (id: string) => void) => {
    setBreadcrumbs(prev => {
      // Check if breadcrumb already exists
      const existingIndex = prev.findIndex(item => item.id === breadcrumb.id);
      
      if (existingIndex !== -1) {
        // If it exists, remove all breadcrumbs after it and make it active
        const newBreadcrumbs = prev.slice(0, existingIndex + 1).map((item, index, arr) => ({
          ...item,
          isActive: index === arr.length - 1,
          onClick: index < arr.length - 1 ? () => onNavigate?.(item.id) : undefined,
        }));
        return newBreadcrumbs;
      } else {
        // If it doesn't exist, add it as the new active breadcrumb
        const newBreadcrumbs = prev.map(item => ({
          ...item,
          isActive: false,
          onClick: () => onNavigate?.(item.id),
        }));
        
        newBreadcrumbs.push({
          id: breadcrumb.id,
          label: breadcrumb.label,
          icon: breadcrumb.icon,
          isActive: true,
          onClick: undefined,
        });
        
        return newBreadcrumbs;
      }
    });
  }, []);

  const removeBreadcrumb = useCallback((id: string) => {
    setBreadcrumbs(prev => {
      const index = prev.findIndex(item => item.id === id);
      if (index === -1) return prev;
      
      const newBreadcrumbs = prev.slice(0, index);
      if (newBreadcrumbs.length > 0) {
        newBreadcrumbs[newBreadcrumbs.length - 1].isActive = true;
        newBreadcrumbs[newBreadcrumbs.length - 1].onClick = undefined;
      }
      
      return newBreadcrumbs;
    });
  }, []);

  const clearBreadcrumbs = useCallback(() => {
    setBreadcrumbs([]);
  }, []);

  const goBack = useCallback((onNavigate?: (id: string) => void) => {
    setBreadcrumbs(prev => {
      if (prev.length <= 1) return prev;
      
      const newBreadcrumbs = prev.slice(0, -1);
      if (newBreadcrumbs.length > 0) {
        const lastItem = newBreadcrumbs[newBreadcrumbs.length - 1];
        lastItem.isActive = true;
        lastItem.onClick = undefined;
        
        // Navigate to the previous breadcrumb
        onNavigate?.(lastItem.id);
      }
      
      return newBreadcrumbs;
    });
  }, []);

  return {
    breadcrumbs,
    updateBreadcrumbs,
    addBreadcrumb,
    removeBreadcrumb,
    clearBreadcrumbs,
    goBack,
  };
};