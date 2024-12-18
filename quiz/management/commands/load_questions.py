import csv
from django.core.management.base import BaseCommand
from quiz.models import Question

class Command(BaseCommand):
    help = 'Load questions from a CSV file'

    def add_arguments(self, parser):
        parser.add_argument('csv_file', type=str, help='Path to the CSV file')

    def handle(self, *args, **kwargs):
        csv_file = kwargs['csv_file']
        with open(csv_file, 'r') as file:
            reader = csv.DictReader(file)
            for row in reader:
                Question.objects.create(
                    text=row['question_text'],
                    options= {"A" : row['option_a'], "B": row['option_b'], "C" : row['option_c'], "D" : row['option_d'] },  # Options as JSON (e.g., {"A": "Option 1", "B": "Option 2"})
                    correct_option=row['correct_option']
                )
        self.stdout.write(self.style.SUCCESS('Questions loaded successfully!'))
