NODE := $(shell which node)
NPM := $(shell which npm)
NODEUNIT := ./node_modules/nodeunit/bin/nodeunit

TEST_DIR := ./tests
BUILD_DIR := ./build

JSHINT_FILE := ${BUILD_DIR}/jshint.js
JSHINT_TARGETS := ./*.js ./src/*.js

all: node_modules hint check

node_modules:
	${NPM} install

check:
	${NODEUNIT} ${TEST_DIR}

hint:
	@@for file in `ls ${JSHINT_TARGETS}`; do \
		echo "Hinting: $$file"; \
		${NODE} ${JSHINT_FILE} $$file; \
		echo "--------------------------"; \
	done
