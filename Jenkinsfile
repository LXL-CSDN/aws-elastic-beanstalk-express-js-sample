pipeline {
    agent none

    environment {
        IMAGE_NAME = "docker.io/deer20010203/eb-node-sample"
        REGISTRY_CREDENTIALS = "dockerhub-creds"
    }

    stages {
        stage('Install & Test (Node16)') {
            agent {
                docker {
                    image 'node:16'
                    args '-u root'
                    reuseNode true
                }
            }
            steps {
                echo 'Checking Node.js and npm versions...'
                sh 'node -v && npm -v'
                
                echo 'Installing dependencies...'
                sh 'npm install --save'
                
                echo 'Running unit tests...'
                sh 'npm test'
                
                echo 'Archiving test results...'
                junit 'reports/junit/*.xml'
                archiveArtifacts artifacts: 'reports/**/*', allowEmptyArchive: true
            }
        }

        stage('Dependency Scan - Snyk (fail on HIGH/CRITICAL)') {
            agent {
                docker {
                    image 'snyk/snyk:docker'
                    args "-e SNYK_TOKEN"
                    reuseNode true
                }
            }
            environment { 
                SNYK_TOKEN = credentials('snyk-token') 
            }
            steps {
                echo 'Authenticating with Snyk...'
                sh 'snyk auth $SNYK_TOKEN'
                
                echo 'Running dependency vulnerability scan...'
                // Fails if a HIGH or CRITICAL vulnerability is detected
                sh 'snyk test --severity-threshold=high'
            }
        }

        stage('Build & Push Image') {
            agent any
            steps {
                script {
                    echo 'Building Docker image...'
                    sh 'docker version'
                    def app = docker.build("${IMAGE_NAME}:${env.BUILD_NUMBER}")
                    
                    echo 'Pushing image to Docker Hub...'
                    docker.withRegistry('', REGISTRY_CREDENTIALS) {
                        app.push()
                        app.push('latest')
                    }
                }
            }
        }
    }

    post {
        always {
            node('') {
                echo 'Archiving Dockerfile and cleaning workspace...'
                archiveArtifacts artifacts: 'Dockerfile,.dockerignore', allowEmptyArchive: true
                cleanWs()
            }
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed. Check logs for details.'
        }
    }
}
