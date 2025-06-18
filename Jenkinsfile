pipeline {
    agent any
    
    // environment variables - differ from compose
    environment {
        DB_NAME = 'quote-db-jenkins'
        APP_NAME = 'quote-web-jenkins'
        POSTGRES_USER = 'quote_user_jenkins'
        POSTGRES_DB = 'quote_db_jenkins'
        POSTGRES_PASSWORD = credentials('POSTGRES_PASSWORD')
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
                withCredentials([string(credentialsId: 'POSTGRES_PASSWORD', variable: 'POSTGRES_PASSWORD')]) {
                    script {
                        def dbUrl = 'postgres://' + env.POSTGRES_USER + ':' + POSTGRES_PASSWORD + '@db:5432/' + env.POSTGRES_DB
                        
                        withEnv([
                            "DB_NAME=${env.DB_NAME}",
                            "APP_NAME=${env.APP_NAME}",
                            "POSTGRES_USER=${env.POSTGRES_USER}",
                            "POSTGRES_PASSWORD=${POSTGRES_PASSWORD}",
                            "POSTGRES_DB=${env.POSTGRES_DB}",
                            "DATABASE_URL=${dbUrl}"
                        ]) {
                            sh 'docker-compose --project-name "jenkins" up -d --build'
                        }
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
