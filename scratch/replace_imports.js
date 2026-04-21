const fs = require('fs');
const path = require('path');

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) { 
      walk(fullPath); 
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Specifically target requireAuth and getCurrentUser moving to auth-server
      let modified = content.replace(/import\s+\{\s*([^}]*?(?:requireAuth|getCurrentUser|requireSuperAdmin)[^}]*?)\s*\}\s+from\s+["']@\/lib\/auth["']/g, 'import { $1 } from "@/lib/auth-server"');

      if (content !== modified) {
        fs.writeFileSync(fullPath, modified, 'utf8');
        console.log('Updated', fullPath);
      }
    }
  }
}

walk('p:/TMS-github/app');
