// Kiểm tra email
export function isValidEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

// Kiểm tra số điện thoại
export function isValidPhone(phone) {
  const re = /^(0|\+84)(\s|\.)?((3[2-9])|(5[689])|(7[06-9])|(8[1-689])|(9[0-46-9]))(\d)(\s|\.)?(\d{3})(\s|\.)?(\d{3})$/;
  return re.test(String(phone));
}

// Kiểm tra mật khẩu (ít nhất 6 ký tự, có chữ hoa, chữ thường và số)
export function isStrongPassword(password) {
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;
  return re.test(String(password));
}

// Kiểm tra ngày tháng
export function isValidDate(dateString) {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

// Kiểm tra số dương
export function isPositiveNumber(value) {
  return !isNaN(value) && Number(value) >= 0;
}

// Kiểm tra năm xuất bản hợp lệ
export function isValidPublishYear(year) {
  const currentYear = new Date().getFullYear();
  return !isNaN(year) && Number(year) >= 1900 && Number(year) <= currentYear;
}

// Kiểm tra form đăng nhập
export function validateLoginForm(data) {
  const errors = {};
  
  if (!data.email) {
    errors.email = 'Email không được để trống';
  } else if (!isValidEmail(data.email)) {
    errors.email = 'Email không hợp lệ';
  }
  
  if (!data.password) {
    errors.password = 'Mật khẩu không được để trống';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

// Kiểm tra form đăng ký độc giả
export function validateReaderForm(data) {
  const errors = {};
  
  if (!data.hoTenDG) {
    errors.hoTenDG = 'Họ tên không được để trống';
  }
  
  if (!data.email) {
    errors.email = 'Email không được để trống';
  } else if (!isValidEmail(data.email)) {
    errors.email = 'Email không hợp lệ';
  }
  
  if (!data.password) {
    errors.password = 'Mật khẩu không được để trống';
  } else if (!isStrongPassword(data.password)) {
    errors.password = 'Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ hoa, chữ thường và số';
  }
  
  if (!data.soDienThoai) {
    errors.soDienThoai = 'Số điện thoại không được để trống';
  } else if (!isValidPhone(data.soDienThoai)) {
    errors.soDienThoai = 'Số điện thoại không hợp lệ';
  }
  
  if (!data.ngaySinh) {
    errors.ngaySinh = 'Ngày sinh không được để trống';
  } else if (!isValidDate(data.ngaySinh)) {
    errors.ngaySinh = 'Ngày sinh không hợp lệ';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

// Kiểm tra form sách
export function validateBookForm(data) {
  const errors = {};
  
  if (!data.tenSach) {
    errors.tenSach = 'Tên sách không được để trống';
  }
  
  if (!data.tacGia) {
    errors.tacGia = 'Tác giả không được để trống';
  }
  
  if (!data.maNhaXuatBan) {
    errors.maNhaXuatBan = 'Nhà xuất bản không được để trống';
  }
  
  if (!data.namXuatBan) {
    errors.namXuatBan = 'Năm xuất bản không được để trống';
  } else if (!isValidPublishYear(data.namXuatBan)) {
    errors.namXuatBan = 'Năm xuất bản không hợp lệ';
  }
  
  if (data.soLuong === undefined || data.soLuong === null) {
    errors.soLuong = 'Số lượng không được để trống';
  } else if (!isPositiveNumber(data.soLuong)) {
    errors.soLuong = 'Số lượng phải là số dương';
  }
  
  if (data.gia === undefined || data.gia === null) {
    errors.gia = 'Đơn giá không được để trống';
  } else if (!isPositiveNumber(data.gia)) {
    errors.gia = 'Đơn giá phải là số dương';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

// Kiểm tra form phiếu mượn
export function validateBorrowForm(data) {
  const errors = {};
  
  if (!data.maDocGia) {
    errors.maDocGia = 'Độc giả không được để trống';
  }
  
  if (!data.maSach) {
    errors.maSach = 'Sách không được để trống';
  }
  
  if (!data.ngayMuon) {
    errors.ngayMuon = 'Ngày mượn không được để trống';
  } else if (!isValidDate(data.ngayMuon)) {
    errors.ngayMuon = 'Ngày mượn không hợp lệ';
  }
  
  if (!data.ngayHenTra) {
    errors.ngayHenTra = 'Ngày hẹn trả không được để trống';
  } else if (!isValidDate(data.ngayHenTra)) {
    errors.ngayHenTra = 'Ngày hẹn trả không hợp lệ';
  }
  
  // Kiểm tra ngày hẹn trả phải sau ngày mượn
  if (data.ngayMuon && data.ngayHenTra && isValidDate(data.ngayMuon) && isValidDate(data.ngayHenTra)) {
    const ngayMuon = new Date(data.ngayMuon);
    const ngayHenTra = new Date(data.ngayHenTra);
    
    if (ngayHenTra <= ngayMuon) {
      errors.ngayHenTra = 'Ngày hẹn trả phải sau ngày mượn';
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}