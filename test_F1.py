import unittest
from F1 import app

class testF1(unittest.TestCase):
    def test_home(self):
        self.assertNotEqual(app, "<Flask 'F1'>")


