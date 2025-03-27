<template>
  <div class="app-container">
    <router-view />
  </div>
</template>

<script setup>
// App.vue - Component gốc của ứng dụng
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');

:root {
  /* Bảng màu pastel mới */
  --primary-color: #ff877d;
  --secondary-color: #ffc4ae;
  --accent-color: #c2cf67;
  --light-bg: #ede7d3;
  --warm-bg: #ffd5a6;
  
  /* Gradient chỉ áp dụng cho một số phần tử */
  --primary-gradient: linear-gradient(to right, #ff877d, #ffc4ae, #ede7d3, #ffd5a6, #c2cf67);
  
  --text-color: #63371e;
  --light-text: #fff;
  --border-color: #ddd;
  --bg-light: #ffd5a6;
  --bg-dark: #1a1a1a;
  --success-color: #4caf50;
  --warning-color: #ff9800;
  --error-color: #f44336;
  --shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Roboto', sans-serif;
  color: var(--text-color);
  background-color: var(--bg-light);
  line-height: 1.6;
  margin: 0;
  padding: 0;
  width: 100%;
  min-height: 100vh;
}

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
}

/* Đảm bảo tất cả nội dung được căn giữa */
.content-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Đảm bảo layout container căn giữa nội dung */
.layout-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
}

.content-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: var(--bg-light);
  width: 100%;
  margin-top: 60px; /* Để tránh bị che bởi navbar */
}

.main-content {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

/* Card grid cho hiển thị sách */
.books-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  width: 100%;
  margin: 0 auto;
}

.book-list-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

/* Cố định các thành phần không cần thay đổi khi tìm kiếm */
.fixed-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  width: 100%;
  background-color: white;
}

.filters {
  background-color: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: var(--shadow);
  margin-bottom: 1.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: flex-end;
}

.filter-group {
  flex: 1;
  min-width: 200px;
}

.filter-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

/* Gradient text cho tiêu đề */
.gradient-text {
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

/* Các style chung */
.btn {
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
}

.btn-secondary {
  background-color: white;
  color: var(--primary-color);
  border: 1px solid var(--primary-color);
}

.btn-danger {
  background-color: var(--error-color);
  color: white;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.form-group {
  margin-bottom: 1rem;
}

.form-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-row .form-group {
  flex: 1;
}

.form-control {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 14px;
  color: var(--text-color);
}

.form-control:focus {
  outline: none;
  border-color: var(--primary-color);
}

.card {
  background: white;
  border-radius: 8px;
  box-shadow: var(--shadow);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th {
  background-color: var(--primary-color);
  color: white;
  text-align: left;
  padding: 12px;
}

.table td {
  padding: 12px;
  border-bottom: 1px solid var(--border-color);
  color: var(--text-color);
}

.table tr:hover {
  background-color: rgba(255, 135, 125, 0.05);
}

.pagination {
  display: flex;
  justify-content: center;
  list-style: none;
  margin: 1rem 0;
}

.pagination li {
  margin: 0 5px;
}

.pagination button {
  padding: 5px 10px;
  border: 1px solid var(--border-color);
  background: white;
  cursor: pointer;
  color: var(--text-color);
}

.pagination button.active {
  background-color: var(--primary-color);
  color: white;
  border: none;
}

.alert {
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.alert-success {
  background-color: rgba(76, 175, 80, 0.1);
  color: var(--success-color);
  border: 1px solid var(--success-color);
}

.alert-error {
  background-color: rgba(244, 67, 54, 0.1);
  color: var(--error-color);
  border: 1px solid var(--error-color);
}

.alert-warning {
  background-color: rgba(255, 152, 0, 0.1);
  color: var(--warning-color);
  border: 1px solid var(--warning-color);
}

.alert-info {
  background-color: rgba(33, 150, 243, 0.1);
  color: #2196f3;
  border: 1px solid #2196f3;
}

.status-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-pending {
  background-color: rgba(255, 152, 0, 0.1);
  color: var(--warning-color);
}

.status-approved {
  background-color: rgba(76, 175, 80, 0.1);
  color: var(--success-color);
}

.status-returned {
  background-color: rgba(33, 150, 243, 0.1);
  color: #2196f3;
}

.status-canceled {
  background-color: rgba(244, 67, 54, 0.1);
  color: var(--error-color);
}

/* Cập nhật CSS cho book-card */
.book-card {
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: var(--shadow);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.book-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.book-cover {
  height: 200px;
  overflow: hidden;
  background-color: var(--light-bg);
}

.book-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.book-info {
  padding: 1rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.book-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--text-color);
}

.book-author {
  font-size: 0.9rem;
  color: var(--text-color);
  margin-bottom: 0.25rem;
}

.book-publisher {
  font-size: 0.85rem;
  color: var(--text-color);
  margin-bottom: 0.5rem;
}

.book-details {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  font-size: 0.85rem;
  color: var(--text-color);
}

.book-actions {
  margin-top: auto;
  display: flex;
  gap: 0.5rem;
}

.book-actions .btn {
  flex: 1;
}

/* Cập nhật CSS cho auth container */
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100%;
  padding: 1rem;
  background-color: var(--bg-light);
}

.auth-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: var(--shadow);
  width: 100%;
  max-width: 400px;
  padding: 2rem;
}

/* Modal styles */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  color: #666;
}

.modal-body {
  padding: 1rem;
}

.modal-footer {
  padding: 1rem;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

/* Responsive */
@media (max-width: 992px) {
  .books-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
    gap: 0;
  }
  
  .filters {
    flex-direction: column;
  }
}

@media (max-width: 576px) {
  .books-grid {
    grid-template-columns: 1fr;
  }
}
</style>