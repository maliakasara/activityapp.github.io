#ifndef PLAYER_PROFILE_SYSTEM_H
#define PLAYER_PROFILE_SYSTEM_H

#include <string>
#include <vector>

// Forward declarations
class Goal;
class Achievement;
class MatchRecord;

class Player {
protected:
    std::string name;
    int jerseyNumber;
    std::string position;
    std::vector<Goal*> goals;
    std::vector<Achievement*> achievements;
    std::vector<MatchRecord*> matchRecords;

public:
    Player(std::string name, int jerseyNumber, std::string position);

    std::string getName() const;
    int getJerseyNumber() const;
    std::string getPosition() const;

    void addGoal(Goal* goal);
    void addAchievement(Achievement* achievement);
    void addMatchRecord(MatchRecord* record);

    void displayProfile() const;
};

class Alumni : public Player {
private:
    std::string graduationYear;
    std::string currentOccupation;

public:
    Alumni(std::string name, int jerseyNumber, std::string position, 
           std::string graduationYear, std::string currentOccupation);

    std::string getGraduationYear() const;
    std::string getCurrentOccupation() const;
};

class Goal {
private:
    std::string description;
    std::string date;
    bool isCompleted;

public:
    Goal(std::string description, std::string date, bool isCompleted);

    std::string getDescription() const;
    std::string getDate() const;
    bool getCompletionStatus() const;
};

class Achievement {
private:
    std::string title;
    std::string date;
    std::string description;

public:
    Achievement(std::string title, std::string date, std::string description);

    std::string getTitle() const;
    std::string getDate() const;
    std::string getDescription() const;
};

class MatchRecord {
private:
    std::string opponentTeam;
    std::string date;
    int score;
    std::string performanceSummary;

public:
    MatchRecord(std::string opponentTeam, std::string date, int score, std::string summary);

    std::string getOpponentTeam() const;
    std::string getDate() const;
    int getScore() const;
    std::string getPerformanceSummary() const;
};

class Team {
private:
    std::string teamName;
    std::vector<Player*> players;

public:
    Team(std::string teamName);
    
    void addPlayer(Player* player);
    std::string getTeamName() const;
    void listPlayers() const;
};

class PlayerDatabase {
private:
    std::vector<Player*> allPlayers;

public:
    void addPlayer(Player* player);
    void listAllPlayers() const;
    Player* findPlayerByName(std::string name);
};

#endif // PLAYER_PROFILE_SYSTEM_H
