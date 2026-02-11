import os

for r, d, f in os.walk('app'):
    for name in f:
        if name == 'page.tsx':
            p = os.path.join(r, name)
            with open(p, 'r') as f:
                c = f.read()
            if 'force-dynamic' not in c:
                with open(p, 'w') as f:
                    f.write('export const dynamic = "force-dynamic";\n' + c)
                print(f"Fixed {p}")