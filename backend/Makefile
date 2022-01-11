API_PORT=4000
DSN=postgres://mrz:16Eugene89@localhost:5433/movies?sslmode=disable
GO_MOVIES_JWT=2dce505d96a53c5768052ee90f3df2055657518dad489160df9913f66042e160

## build: builds all binaries
build: clean build_back
	@printf "All binaries built!\n"

## clean: cleans all binaries and runs go clean
clean:
	@echo "Cleaning..."
	@- rm -f dist/*
	@go clean
	@echo "Cleaned!"

## build_api: builds the backend
build_back:
	@echo "Building back end..."
	@go build -o dist/api ./cmd/api
	@echo "Back end built!"

## start: starts front and back end
start: start_back

## start_back: starts the back end
start_back: build_back
	@echo "Starting the back end..."
	@env GO_MOVIES_JWT=${GO_MOVIES_JWT} ./dist/api -port=${API_PORT} -dsn="${DSN}" &
	@echo "Back end running!"

## stop: stops the front and back end
stop: stop_back
	@echo "All applications stopped"

## stop_back: stops the back end
stop_back:
	@echo "Stopping the back end..."
	@-pkill -SIGTERM -f "api -port=${API_PORT}"
	@echo "Stopped back end"

