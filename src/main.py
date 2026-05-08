"""
Main module for TMS
Enhanced on 2026-05-08
"""

from .utils import DataProcessor, get_current_timestamp

class TmsApp:
    """Main application class"""

    def __init__(self):
        self.processor = DataProcessor()
        self.started_at = get_current_timestamp()

    def run(self):
        """Run the main application"""
        print(f"Starting {self.__class__.__name__} at {self.started_at}")

        # Example processing
        sample_data = ['item1', 'item2', 'item3']
        results = self.processor.batch_process(sample_data)

        print(f"Processed {len(results)} items")
        return results

    def get_info(self):
        """Get application information"""
        return {
            'app_name': 'TMS',
            'started_at': self.started_at,
            'processor_stats': self.processor.get_stats()
        }

def main():
    """Main entry point"""
    app = TmsApp()
    return app.run()

if __name__ == '__main__':
    main()
