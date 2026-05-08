"""
Performance optimizations for TMS
Applied on 2026-05-08
"""

import time
import functools
from typing import Any, Callable

def timing_decorator(func: Callable) -> Callable:
    """Decorator to measure function execution time"""
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        start_time = time.time()
        result = func(*args, **kwargs)
        end_time = time.time()

        execution_time = end_time - start_time
        print(f"{func.__name__} executed in {execution_time:.4f} seconds")

        return result
    return wrapper

def memoize(func: Callable) -> Callable:
    """Memoization decorator for caching function results"""
    cache = {}

    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        # Create cache key from arguments
        key = str(args) + str(sorted(kwargs.items()))

        if key not in cache:
            cache[key] = func(*args, **kwargs)

        return cache[key]

    return wrapper

class PerformanceMonitor:
    """Monitor and optimize performance"""

    def __init__(self):
        self.metrics = {}

    def track_operation(self, operation_name: str):
        """Context manager to track operation performance"""
        return OperationTracker(self, operation_name)

    def record_metric(self, name: str, value: float):
        """Record a performance metric"""
        if name not in self.metrics:
            self.metrics[name] = []

        self.metrics[name].append({
            'value': value,
            'timestamp': time.time()
        })

    def get_average(self, metric_name: str) -> float:
        """Get average value for a metric"""
        if metric_name not in self.metrics:
            return 0.0

        values = [m['value'] for m in self.metrics[metric_name]]
        return sum(values) / len(values) if values else 0.0

class OperationTracker:
    """Context manager for tracking operation performance"""

    def __init__(self, monitor: PerformanceMonitor, operation_name: str):
        self.monitor = monitor
        self.operation_name = operation_name
        self.start_time = None

    def __enter__(self):
        self.start_time = time.time()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        if self.start_time:
            duration = time.time() - self.start_time
            self.monitor.record_metric(self.operation_name, duration)
