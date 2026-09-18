import re

with open('src/components/AdminPanelModal.tsx', 'r') as f:
    code = f.read()

code = re.sub(r'      <\/div>\s*<\/div>\s*\);\s*};\s*$', '        </div>\n      </div>\n    </div>\n  );\n};\n', code)

with open('src/components/AdminPanelModal.tsx', 'w') as f:
    f.write(code)
print("Done")
