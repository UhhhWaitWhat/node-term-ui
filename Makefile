BIN = ./node_modules/.bin

build:
	@$(BIN)/tsc
	@$(BIN)/dts-generator --name term-ui --main term-ui --out lib/term-ui.d.ts --baseDir src term-ui.ts

clean:
	@rm -rf lib

docs:
	#@$(BIN)/typedoc --out typedoc defs src/term-ui.ts --module commonjs --target ES5

release-major: clean build docs
	@$(BIN)/bump --major

release-minor: clean build docs
	@$(BIN)/bump --minor

release-patch: clean build docs
	@$(BIN)/bump --patch

publish:
	@npm publish
	@git push --tags origin master
	#@git subtree push --prefix typedoc origin gh-pages
