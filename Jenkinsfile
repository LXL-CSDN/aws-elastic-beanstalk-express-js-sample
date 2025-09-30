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
                    args '-u root -v /var/run/docker.sock:/var/run/docker.sock' 
                }
            }
            steps {
                sh 'node -v && npm -v'
                sh 'npm ci'
                sh 'npm test'
                junit 'reports/junit/*.xml'
                archiveArtifacts artifacts: 'reports/**/*', allowEmptyArchive: true
            }
        }

        stage('Dependency Scan - Snyk (fail on HIGH/CRITICAL)') {
            agent {
                docker {
                    image 'snyk/snyk:docker'
                    args "-e SNYK_TOKEN=\${SNYK_TOKEN}"
                }
            }
            environment { SNYK_TOKEN = credentials('snyk-token') }
            steps {
                sh 'snyk auth $SNYK_TOKEN'
                // Threshold high: High or Critical will return a non-zero exit code, causing the pipeline to fail
                sh 'snyk test --severity-threshold=high' 
            }
        }

        stage('Build & Push Image') {
            agent any 
            steps {
                script {
                    sh 'docker version'
                    def app = docker.build("${IMAGE_NAME}:${env.BUILD_NUMBER}")
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
            archiveArtifacts artifacts: 'Dockerfile,.dockerignore', allowEmptyArchive: true
            cleanWs()
        }
    }
}
