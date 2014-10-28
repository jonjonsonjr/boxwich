me:
	@:
a:
	@:
sandwich:
ifeq ($(shell id -u), 0)
	@echo "Okay."
	node app.js ${ARGS}
else
	@echo "What? Make it yourself."
endif
