pipeline {
    agent any
    
    environment {
        PG_DB_NAME = 'quote_db'
        PG_USER = 'quote_user'
        PG_PASS = credentials('PG_PASS')
    }
    
    stages {
        // for the dev branch
        stage('Checkout') {
            steps {
                git branch: 'dev', url: 'https://github.com/AhmadJanjua/DevOps-Quote-App.git'
            }
        }
        
        // check if the code matches linter standards
        stage('Lint') {
            steps {
                script {
                    docker.image('node:22-alpine').inside {
                        dir('quote-app') {
                            sh '''
                                npm install
                                npm run lint
                            '''
                        }
                    }
                }
            }
        }
        
        // check if the commit passes test cases
        stage('Test') {
            steps {
                script {
                    docker.image('node:22-alpine').inside {
                        dir('quote-app') {
                            sh '''
                                npm install
                                npm run test
                            '''
                        }
                    }
                }
                
                // map where junit tests are stored
                junit 'quote-app/test-results/results.xml'
            }
        }
        
        // create file
        stage('Build') {
            steps {
                script {
                    def PG_URL = 'postgres://' + env.PG_USER + ':' + PG_PASS + '@db:5432/' + env.PG_DB_NAME
                    
                    withEnv([
                        "PG_DB_NAME=${env.PG_DB_NAME}",
                        "PG_USER=${env.PG_USER}",
                        "PG_PASS=${env.PG_PASS}",
                        "PG_URL=${PG_URL}"
                    ]) {
                        sh 'docker-compose --project-name "jenkins" up -d --build'
                    }
                }
            }
        }
    }
    
    post {
        // clean up the resources created
        always {
            sh 'docker-compose --project-name "jenkins" down -v || true'
        }
    }
}
