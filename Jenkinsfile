pipeline {
    agent any

    environment {
        PG_DB_NAME = 'quote_db'
        PG_USER = 'quote_user'
        PI_HOST = '192.168.1.101'
    }

    options {
        skipStagesAfterUnstable()
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                script {
                    echo "Branch: ${env.BRANCH_NAME}"
                    echo "Is PR: ${env.CHANGE_ID != null}"
                    echo "PR Target: ${env.CHANGE_TARGET}"
                }
            }
        }

        stage('Lint & Test') {
            parallel {
                stage('Lint') {
                    steps {
                        script {
                            docker.image('node:22-alpine').inside {
                                dir('quote-app') {
                                    sh 'npm install && npm run lint'
                                }
                            }
                        }
                    }
                }

                stage('Test') {
                    steps {
                        script {
                            docker.image('node:22-alpine').inside {
                                dir('quote-app') {
                                    sh 'npm install && npm run test'
                                }
                            }
                        }
                    }

                    post {
                        always {
                            junit 'quote-app/test-results/results.xml'
                        }
                    }
                }
            }
        }

        stage('Build') {
            when {
                anyOf {
                    branch 'main'
                    changeRequest(target: 'main')
                }
            }
            steps {
                withCredentials([string(credentialsId: 'PG_PASS', variable: 'PG_PASS')]) {
                    script {
                        def PG_URL = "postgres://${env.PG_USER}:${PG_PASS}@db:5432/${env.PG_DB_NAME}"
                        
                        withEnv([
                            "PG_DB_NAME=${env.PG_DB_NAME}",
                            "PG_USER=${env.PG_USER}",
                            "PG_PASS=${PG_PASS}",
                            "PG_URL=${PG_URL}"
                        ]) {
                            sh 'docker-compose --project-name quote-ci up -d --build'
                        }
                    }
                }
            }
        }

        stage('Deploy to Pi') {
            when {
                branch 'main'
            }
            steps {
                script {
                    sh '''
                    ssh -tt pi@$PI_HOST << "EOF"
                        cd ~/DevOps-Quote-App
                        git checkout main
                        git pull
                        docker-compose down
                        docker-compose up -d
                        logout
                    EOF
                    '''
                }
            }
        }
    }

    post {
        always {
            sh 'docker-compose --project-name quote-ci down -v || true'
        }
    }
}
