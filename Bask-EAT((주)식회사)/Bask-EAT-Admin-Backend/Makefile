.PHONY: build run logs stop clean

build:
	docker build -t edge-service:local .

run:
	docker compose up -d --build

logs:
	docker compose logs -f edge-service

stop:
	docker compose down

clean:
	docker rmi edge-service:local || true
