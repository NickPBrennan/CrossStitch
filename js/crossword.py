"""
crossword.py

Nick Brennan

"""
import numpy as np
import sys
import re

"""
Crossword
"""
class Crossword:

	def __init__(self, numRows, numCols, fill = None):
		self.numRows = numRows
		self.numCols = numCols
		if not fill:
			self.grid = np.empty((numRows,numCols))

"""
WordList
TODO: Error Checking
"""
class WordList:


	def __init__(self, filename):
		self.filename = filename
		self.word_list = self.parse_wordlist()

	def parse_wordlist(self):
		wl = open(self.filename, 'r')
		ret = [(line.split(';')[0], int(line.split(';')[1].rstrip())) for line in wl.readlines()]
		wl.close()
		return ret

	def reSearchGen(self, pattern):
		for word_tuple in self.word_list:
			if re.search(pattern, word_tuple[0]):
				yield word_tuple
		




xc = Crossword(15,15)

wl = WordList('/Users/npbrennan/webdev/Crossword/word_list.txt')

search1 = wl.reSearchGen('^aaa....$')
print(search1.next())
print(search1.next())







