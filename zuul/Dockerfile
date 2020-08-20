FROM openjdk:8-jre-alpine

ADD ./zuul/zuul-0.0.1-SNAPSHOT-Docker.jar zuul-0.0.1-SNAPSHOT.jar
ENTRYPOINT ["java", "-jar", "/zuul-0.0.1-SNAPSHOT.jar"]

EXPOSE 8080