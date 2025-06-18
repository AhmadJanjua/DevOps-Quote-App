FROM jenkins/jenkins:lts

USER root

# install docker cli
RUN apt-get update && \
    apt-get install -y curl gnupg apt-transport-https ca-certificates software-properties-common && \
    curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /usr/share/keyrings/docker.gpg && \
    echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker.gpg] https://download.docker.com/linux/debian $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list && \
    apt-get update && \
    apt-get install -y docker-ce-cli

# add docker compose
RUN curl -SL https://github.com/docker/compose/releases/download/v2.24.4/docker-compose-linux-x86_64 -o /usr/local/bin/docker-compose && \
    chmod +x /usr/local/bin/docker-compose

# add permission to use docker
RUN groupadd -f docker && usermod -aG docker jenkins

USER jenkins