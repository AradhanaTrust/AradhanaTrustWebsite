const React = require('react');
const { renderToBuffer, Document, Page, Text, Font, StyleSheet } = require('@react-pdf/renderer');
const path = require('path');
const fs = require('fs');

Font.register({
    family: 'Hind',
    src: path.join(__dirname, 'public/fonts/Hind.ttf')
});

const styles = StyleSheet.create({
    page: { padding: 40 }
});

const TestDoc = () => React.createElement(Document, null, 
    React.createElement(Page, { size: "A4", style: styles.page }, 
        React.createElement(Text, { style: { fontFamily: 'Hind' } }, "सुरेश कुमार")
    )
);

async function test() {
    try {
        console.log("Generating PDF...");
        const buffer = await renderToBuffer(React.createElement(TestDoc));
        fs.writeFileSync('test.pdf', buffer);
        console.log("Success! PDF generated.");
    } catch (e) {
        console.error("Failed:", e.message);
        console.error(e.stack);
    }
}

test();
