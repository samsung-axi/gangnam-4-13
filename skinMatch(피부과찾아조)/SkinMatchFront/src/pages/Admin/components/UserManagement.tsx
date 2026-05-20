import React from 'react';
import { UserFilters } from './UserFilters';
import { BulkActions } from './BulkActions';
import { UserTable } from './UserTable';
import { Pagination } from './Pagination';
import { useUserManagement } from '../hooks/useUserManagement';

export const UserManagement: React.FC = () => {
  const {
    users,
    loading,
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    showFilters,
    setShowFilters,
    selectedUsers,
    selectAll,
    pagination,
    handleSelectAll,
    handleSelectUser,
    handleBulkStatusChange,
    handleBulkDelete,
    handleExportCSV,
    handleResetFilters,
    handleDeleteUser,
    toggleUserStatus,
    loadUsers,
    bulkOperationLoading
  } = useUserManagement();

  return (
    <>
      <UserFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filters={filters}
        setFilters={setFilters}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        onExportCSV={handleExportCSV}
        onResetFilters={handleResetFilters}
        pagination={pagination}
      />

      <BulkActions
        selectedUsers={selectedUsers}
        onBulkStatusChange={handleBulkStatusChange}
        onBulkDelete={handleBulkDelete}
        bulkOperationLoading={bulkOperationLoading}
      />

      <UserTable
        users={users}
        loading={loading}
        searchTerm={searchTerm}
        selectedUsers={selectedUsers}
        selectAll={selectAll}
        onSelectAll={handleSelectAll}
        onSelectUser={handleSelectUser}
        onDeleteUser={handleDeleteUser}
        onToggleUserStatus={toggleUserStatus}
      />

      <Pagination
        pagination={pagination}
        loading={loading}
        onPageChange={loadUsers}
      />
    </>
  );
};