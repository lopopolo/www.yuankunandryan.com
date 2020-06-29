.PHONY: all
all: lint

virtualenv: venv/bin/activate
	./venv/bin/pip install black

venv/bin/activate:
	python3 -m venv venv

.PHONY: lint
lint: format
	npm run lint:fix

.PHONY: format
format: virtualenv
	npm run fmt
	./venv/bin/black --exclude=venv .
