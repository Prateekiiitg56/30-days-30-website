# Inlines Phosphor Light icons ({{name}}) into src/index.src.html -> public/index.html
import re, pathlib
ICONS = pathlib.Path(r'D:\temp\claude\D--CodeForces-DAy1\fd898f4d-63d8-4682-a053-eeb2f4a3ef87\scratchpad\ph')
def icon(m):
    s = (ICONS / f'{m.group(1)}.svg').read_text(encoding='utf8')
    body = re.search(r'<svg[^>]*>(.*)</svg>', s, re.S).group(1)
    return f'<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">{body}</svg>'
src = pathlib.Path('src/index.src.html').read_text(encoding='utf8')
out = re.sub(r'\{\{([a-z-]+)\}\}', icon, src)
pathlib.Path('public/index.html').write_text(out, encoding='utf8')
print('built', len(out))
