test:
	mocha test --reporter spec

coverage:
	rm -rf src-cov
	jscoverage src src-cov
	CHECK_COVERAGE=1 ./node_modules/.bin/mocha\
		 -R html-cov > coverage.html
	rm -rf src-cov
	open coverage.html

.PHONY: test
