FROM openjdk:8-jdk-alpine

ADD ./zuul/zuul-0.0.1-SNAPSHOT-Docker.jar zuul-0.0.1-SNAPSHOT.jar
ENTRYPOINT ["java", "-jar", "/zuul-0.0.1-SNAPSHOT.jar"]

EXPOSE 8080