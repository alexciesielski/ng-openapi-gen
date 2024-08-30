import { OpenAPIObject } from '@loopback/openapi-v3-types';
import { InterfaceDeclaration, TypeAliasDeclaration, TypescriptParser } from 'typescript-parser';
import { NgOpenApiGen } from '../lib/ng-openapi-gen';
import { Options } from '../lib/options';
import options from './const-values.config.json';
import constValuesSpec from './const-values.json';


const gen = new NgOpenApiGen(constValuesSpec as OpenAPIObject, options as Options);
gen.generate();

describe('Generation tests using all-types.json', () => {

  it('const value model', done => {
    const refObject = gen.models.get('CalendarMonthly');
    const ts = gen.templates.apply('model', refObject);
    const parser = new TypescriptParser();
    parser.parseSource(ts).then(ast => {
      expect(ast.imports.length).toBe(0);
      expect(ast.declarations.length).toBe(1);
      expect(ast.declarations[0]).toEqual(jasmine.any(InterfaceDeclaration));
      const decl = ast.declarations[0] as TypeAliasDeclaration;
      expect(decl.name).toBe('CalendarMonthly');
      // There's no support for additional properties in typescript-parser. Check as text.
      const text = ts.substring(decl.start || 0, decl.end || ts.length);
      // eslint-disable-next-line @typescript-eslint/quotes
      expect(text).toContain(`monthly_reminder: 'day' | 'week';`);
      done();
    });
  });
});
