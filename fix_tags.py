import re

with open('src/components/AdminPanelModal.tsx', 'r') as f:
    lines = f.readlines()

# let's find the closing brackets by printing the last 50 lines to see where the main container ends.
