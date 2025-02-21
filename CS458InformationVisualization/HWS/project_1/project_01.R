library(ggplot2)
library(corrplot)
library(dplyr)
library(viridis)
library(GGally)

# Read the dataset
data <- read.csv("~/Desktop/Employee_Salaries.csv")

# Load the ggplot2 library
library(ggplot2)



#This is figure 1
ggplot(data, aes(x = Gender, y = Base_Salary, fill = Gender)) +
  geom_boxplot() +
  labs(title = "Gender-Based Salary Distribution",
       x = "Gender",
       y = "Base Salary in USD") + 
  scale_y_continuous(labels = scales::comma)+
  theme_minimal()

# This is figure 2
ggplot(data, aes(x = Department_Name, y = Base_Salary, fill = Gender)) +
  geom_bar(stat = "summary", fun = "mean", position = "dodge", width = 0.9) +  # Increase bar width
  labs(title = "Gender Pay Discrepancies by Department",
       x = "Department",
       y = "Average Base Salary in USD") +
  theme_minimal() +
  theme(axis.text.x = element_text(angle = 57, hjust=1))





#This is figure 4 correlation 
# Compute the average salary for each department
avg_salary <- data %>% 
  group_by(Department_Name) %>% 
  summarise(avg_salary = mean(Base_Salary))

# Compute the correlation
correlation <- cor(avg_salary$avg_salary, as.numeric(factor(avg_salary$Department_Name)))

avg_salary_by_grade$Grade <- as.numeric(as.factor(avg_salary_by_grade$Grade))
correlation <- cor(avg_salary_by_grade$Grade, avg_salary_by_grade$avg_salary)

# Plot corrrelation between grade and averga salary 
ggplot(avg_salary_by_grade, aes(x = Grade, y = avg_salary)) +
  geom_point() +
  labs(title = "Correlation between Grade and Average Salary",
       x = "Grade",
       y = "Average Salary in USD") +
  geom_smooth(method = "lm", se = FALSE) +  # Add a linear regression line
  annotate("text", x = 0.5, y = max(avg_salary_by_grade$avg_salary),
           label = paste("Correlation:", round(correlation, 2)), size = 3, color = "red") +
  scale_y_continuous(labels = scales::comma)+
  theme_minimal()



# This is figure 3 heatmap
# Calculate average base salary by department and gender
avg_salary <- aggregate(Base_Salary ~ Department_Name + Gender, data, mean)
# Create the heatmap
ggplot(avg_salary, aes(x = Department_Name, y = Gender, fill = Base_Salary)) +
  geom_tile(color = "white", width = 0.8, height = 1.2) +
  scale_fill_viridis(name = "Average Base Salary in USD", option = "plasma") +
  labs(title = "Heatmap of Salary Distribution by Department and Gender",
       x = "Department",
       y = "Gender") +
  theme_minimal() +
  theme(axis.text.x = element_text(angle = 71, hjust = 1, size = 8),
        axis.text.y = element_text(size = 8),
        plot.title = element_text(size = 12, face = "bold"))



# This is figure 5 
# Create the parallel coordinates plot
salary_attributes$Group <- data$Department_Name 
ggparcoord(salary_attributes, 
           columns = c("Base_Salary", "Overtime_Pay", "Longevity_Pay"),
           groupColumn = "Group", 
           scale = "std",  # Scale the data based on standard deviation
           alphaLines = 0.5,  
           order = "allClass") +  # Order by class
  labs(title = "Parallel Coordinates Plot of Salary Attributes",
       x = "Salary Attributes in USD",
       y = "Value") +
  theme_minimal() +
  theme(plot.title = element_text(size = 16, face = "bold"),
        axis.title.x = element_text(size = 14),
        axis.title.y = element_text(size = 14),
        axis.text = element_text(size = 12))
