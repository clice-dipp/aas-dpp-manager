
# README

This guide will walk you through setting up your application using Docker and Docker Compose or to help you start it locally

## Table of Contents
- [Run the Application](#run-application-locally)
  - [Start Backend](#start-backend)
  - [Start Frontend](#start-frontend)
- [Prerequisites](#prerequisites-for-deployment)
- [Building the Application](#building-the-application)
  - [Building clicedipp-frontend](#building-clicedipp-frontend)
  - [Building clicedipp-backend](#building-clicedipp-backend)
- [Saving Docker Images Locally](#saving-docker-images-locally)
- [Transporting Images to Remote Server](#transporting-images-to-remote-server)
- [Loading Images Remotely and Running Docker Compose](#loading-images-remotely-and-running-docker-compose)
- [Ensure that the images are running](#ensure-that-the-images-are-running)

## Run Application Locally

Start your MySQL Database with XXAMP Control Panel and make sure that a database named aasservice is existing. If not create a new one with this name.

### Start Backend

Ensure you have the environment variables on local mode. Use the [switch_development.ps1](./switch_development.ps1)-Script for that. When you are in local development mode then just start the backend by clicking on the run button in vscode at the [AASServiceApplication](./01_backend/aasservice/src/main/java/com/softwareag/aasservice/AasServiceApplication.java)-file.

### Start Frontend

To start the frontend navigate to the following directory:

```bash
cd ./02_frontend/app/

yarn start
```

And start the react development server with yarn start.

## Prerequisites for Deployment

Ensure you have Docker and Docker Compose installed on your system. You can download and install Docker from [here](https://www.docker.com/products/docker-desktop). Alternatively, you can use Rancher Desktop from the Company Portal. Once started, the Docker engine will be running as well.

## Quick Deployment with Scripts

The quick way to deploy is to use the [switch_development.psi](./switch_development.ps1)-Script to ensure that your environment variables are on deployment mode. And then just run the [build_and_save_images.ps1](./build_and_save_images.ps1)-Script. Then continue with the instructions at [Transporting Images](#transporting-images-to-remote-server).

## Building the Application

### Building clicedipp-frontend

Navigate to the frontend directory and build the Docker image:

```bash
cd 02_frontend/app/
docker build -t clicedipp-frontend .
```

### Building clicedipp-backend

Navigate to the backend directory and build the Docker image:

```bash
cd 01_backend/aasservice/
docker build -t clicedipp-backend .
```

## Saving Docker Images Locally

To save the Docker images to tar files, use the following commands:

```bash
docker save -o clicedipp-backend.tar clicedipp-backend
docker save -o clicedipp-frontend.tar clicedipp-frontend
```

## Transporting Images to Remote Server

Use a FTP-Client or any other secure method to transfer the tar files, the [docker-compose](./docker-compose.yml) and the [init.sql](./init.sql) file to your remote server. I did it with [Win-SCP](https://winscp.net/eng/index.php), due to the easy Putty session import.

## Loading Images Remotely and Running Docker Compose

SSH into your remote server, load the Docker images, and run the Docker Compose setup:

```bash
docker load -i clicedipp-backend.tar
docker load -i clicedipp-frontend.tar

docker-compose up
```

Ensure the `docker-compose.yml` file is in the root directory on your remote server. This setup will start the application using Docker Compose.

## Ensure that the images are running

Afterwards you can ensure that the images are running with the command:

```bash
docker-compose ps
```
