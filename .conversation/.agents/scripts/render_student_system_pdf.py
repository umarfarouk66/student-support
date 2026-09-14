import fitz, os
src='attached_assets/web_base_student_consultation_and_counseling_session_system_1789422969876.pdf'
out='.agents/outputs/student-system-pages'
os.makedirs(out, exist_ok=True)
doc=fitz.open(src)
print('pages', doc.page_count, 'metadata', doc.metadata)
for i,page in enumerate(doc):
    pix=page.get_pixmap(matrix=fitz.Matrix(1.5,1.5), alpha=False)
    path=f'{out}/page-{i+1}.png'
    pix.save(path)
    text=page.get_text('text')
    print('page', i+1, 'size', page.rect.width, page.rect.height, 'text_chars', len(text), 'rendered', path)
    print(text[:1200].replace('\n',' | '))
