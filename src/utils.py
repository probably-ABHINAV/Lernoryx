"""
Utility functions for TMS
Enhanced on 2026-05-08
"""

import datetime
import json
from typing import Any, Dict, List, Optional, Union

def get_current_timestamp() -> str:
    """Get current ISO timestamp"""
    return datetime.datetime.now().isoformat()

def validate_data(data: Any) -> bool:
    """Validate input data"""
    if data is None:
        return False
    if isinstance(data, str) and not data.strip():
        return False
    return True

def format_json(data: Dict) -> str:
    """Format dictionary as pretty JSON"""
    return json.dumps(data, indent=2, sort_keys=True)

def safe_get(dictionary: Dict, key: str, default: Any = None) -> Any:
    """Safely get value from dictionary"""
    return dictionary.get(key, default)

class DataProcessor:
    """Enhanced data processing utilities"""

    def __init__(self):
        self.created_at = get_current_timestamp()
        self.processed_count = 0

    def process_item(self, item: Any) -> Optional[Dict]:
        """Process a single item"""
        if not validate_data(item):
            return None

        self.processed_count += 1
        return {
            'data': item,
            'processed_at': get_current_timestamp(),
            'processor_id': id(self)
        }

    def batch_process(self, items: List[Any]) -> List[Dict]:
        """Process multiple items"""
        results = []
        for item in items:
            processed = self.process_item(item)
            if processed:
                results.append(processed)
        return results

    def get_stats(self) -> Dict:
        """Get processing statistics"""
        return {
            'created_at': self.created_at,
            'processed_count': self.processed_count,
            'current_time': get_current_timestamp()
        }

# Helper functions
def merge_dicts(*dicts: Dict) -> Dict:
    """Merge multiple dictionaries"""
    result = {}
    for d in dicts:
        result.update(d)
    return result

def chunk_list(lst: List, chunk_size: int) -> List[List]:
    """Split list into chunks"""
    return [lst[i:i + chunk_size] for i in range(0, len(lst), chunk_size)]
