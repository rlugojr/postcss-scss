import parse from '../lib/scss-parse';

import { expect } from 'chai';
import   cases    from 'postcss-parser-tests';

describe('SCSS Parser', () => {

    cases.each( (name, css, json) => {
        it('parses ' + name, () => {
            let parsed = cases.jsonify(parse(css, { from: name }));
            expect(parsed).to.eql(json);
        });
    });

    it('parses nested rules', () => {
        let root = parse('a { b {} }');
        expect(root.first.first.selector).to.eql('b');
    });

    it('parses at-rules inside rules', () => {
        let root = parse('a { @media {} }');
        expect(root.first.first.name).to.eql('media');
    });

    it('parses variables', () => {
        let root = parse('$var: 1;');
        expect(root.first.prop).to.eql('$var');
        expect(root.first.value).to.eql('1');
    });

    it('parses inline comments', () => {
        let root = parse('\n// a \n/* b */');
        expect(root.nodes).to.have.length(2);
        expect(root.first.text).to.eql('a');
        expect(root.first.raw).to.eql({
            before: '\n',
            left:   ' ',
            right:  ' ',
            inline: true
        });
        expect(root.last.text).to.eql('b');
    });

    it('parses empty inline comments', () => {
        let root = parse('//\n// ');
        expect(root.first.text).to.eql('');
        expect(root.first.raw).to.eql({
            before: '',
            left:   '',
            right:  '',
            inline: true
        });
        expect(root.last.text).to.eql('');
        expect(root.last.raw).to.eql({
            before: '\n',
            left:   ' ',
            right:  '',
            inline: true
        });
    });

    it('does not parse comments inside brakets', () => {
        let root = parse('a { cursor: url(http://ya.ru) }');
        expect(root.first.first.value).to.eql('url(http://ya.ru)');
    });

});