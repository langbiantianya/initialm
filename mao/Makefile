build_go:
	GOOS=js GOARCH=wasm CGO_ENABLED=0 go build -o ../static/wasm/app.wasm main.go
	(cd .. && mkdir -p src/lib/process)
	rm ../src/lib/process/* || echo "空目录跳过"
	cp assets/process/* ../src/lib/process/
build:
	GOOS=js GOARCH=wasm tinygo build -o ../static/wasm/app.wasm -no-debug
