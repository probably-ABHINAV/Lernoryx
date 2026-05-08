"""
Security improvements for TMS
Applied on 2026-05-08
"""

import os
import re
import hashlib
from typing import Optional

class SecurityValidator:
    """Security validation utilities"""

    @staticmethod
    def validate_input(user_input: str) -> bool:
        """Validate user input for security"""
        if not user_input:
            return False

        # Check for common injection patterns
        dangerous_patterns = [
            r'<script.*?>',
            r'javascript:',
            r'on\w+\s*=',
            r'eval\s*\(',
            r'exec\s*\('
        ]

        for pattern in dangerous_patterns:
            if re.search(pattern, user_input, re.IGNORECASE):
                return False

        return True

    @staticmethod
    def sanitize_filename(filename: str) -> str:
        """Sanitize filename for safe file operations"""
        # Remove dangerous characters
        safe_filename = re.sub(r'[<>:"/\|?*]', '_', filename)

        # Prevent directory traversal
        safe_filename = safe_filename.replace('..', '_')

        return safe_filename[:255]  # Limit length

    @staticmethod
    def hash_password(password: str, salt: Optional[str] = None) -> tuple:
        """Hash password securely"""
        if salt is None:
            salt = os.urandom(32)

        pwdhash = hashlib.pbkdf2_hmac('sha256', 
                                      password.encode('utf-8'), 
                                      salt, 
                                      100000)
        return pwdhash, salt

    @staticmethod
    def verify_password(password: str, hash_value: bytes, salt: bytes) -> bool:
        """Verify password against hash"""
        pwdhash, _ = SecurityValidator.hash_password(password, salt)
        return pwdhash == hash_value

class ErrorHandler:
    """Enhanced error handling"""

    @staticmethod
    def safe_execute(func, *args, **kwargs):
        """Safely execute function with error handling"""
        try:
            return func(*args, **kwargs)
        except Exception as e:
            print(f"Error executing {func.__name__}: {str(e)}")
            return None

    @staticmethod
    def log_error(error: Exception, context: str = ""):
        """Log error with context"""
        timestamp = datetime.datetime.now().isoformat()
        error_msg = f"[{timestamp}] Error in {context}: {str(error)}"

        # In production, this would go to a proper logging system
        print(error_msg)

        # Could also write to file
        with open('error.log', 'a') as f:
            f.write(error_msg + '\n')
