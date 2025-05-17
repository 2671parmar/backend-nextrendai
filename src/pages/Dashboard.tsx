import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PageHeader from "@/components/common/PageHeader";
import MainLayout from "@/components/layout/MainLayout";
import {
  mockUsers,
  mockMBSCommentary,
  mockTrendingTopics,
} from "@/data/mockData";
import { BarChart, Users, Edit, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    users: 0,
    mbsArticles: 0,
    trendingArticles: 0,
    generalTerms: 0,
  });
  const [loading, setLoading] = useState(true);
  const [latestMBS, setLatestMBS] = useState(null);
  const [latestTrending, setLatestTrending] = useState(null);

  const recentMBSArticle = mockMBSCommentary[0];
  const recentTrendingArticle = mockTrendingTopics[0];

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      const [{ count: users }, { count: mbsArticles }, { count: trendingArticles }, { count: generalTerms }] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("mbs_articles").select("id", { count: "exact", head: true }),
        supabase.from("trending_articles").select("id", { count: "exact", head: true }),
        supabase.from("mortgage_terms").select("id", { count: "exact", head: true }),
      ]);
      setStats({
        users: users ?? 0,
        mbsArticles: mbsArticles ?? 0,
        trendingArticles: trendingArticles ?? 0,
        generalTerms: generalTerms ?? 0,
      });
      setLoading(false);
    };
    fetchStats();
  }, []);

  useEffect(() => {
    const fetchLatest = async () => {
      // Latest MBS Commentary
      const { data: mbs, error: mbsError } = await supabase
        .from("mbs_articles")
        .select("title, description, date")
        .order("date", { ascending: false })
        .limit(1)
        .single();
      setLatestMBS(mbsError ? null : mbs);

      // Latest Trending Topic
      const { data: trending, error: trendingError } = await supabase
        .from("trending_articles")
        .select("title, description, date")
        .order("date", { ascending: false })
        .limit(1)
        .single();
      setLatestTrending(trendingError ? null : trending);
    };
    fetchLatest();
  }, []);

  return (
    <MainLayout>
      <PageHeader 
        title="Admin Dashboard" 
        description="Welcome to the NEXTREND.AI admin dashboard"
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="nextrend-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-nextrend-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "-" : stats.users}</div>
            <p className="text-xs text-muted-foreground">
              Registered users and clients
            </p>
          </CardContent>
        </Card>

        <Card className="nextrend-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">MBS Commentaries</CardTitle>
            <FileText className="h-4 w-4 text-nextrend-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "-" : stats.mbsArticles}</div>
            <p className="text-xs text-muted-foreground">
              Total MBS commentary articles
            </p>
          </CardContent>
        </Card>

        <Card className="nextrend-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Trending Topics</CardTitle>
            <BarChart className="h-4 w-4 text-nextrend-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "-" : stats.trendingArticles}</div>
            <p className="text-xs text-muted-foreground">
              Total trending topic articles
            </p>
          </CardContent>
        </Card>

        <Card className="nextrend-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">General Terms</CardTitle>
            <Edit className="h-4 w-4 text-nextrend-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "-" : stats.generalTerms}</div>
            <p className="text-xs text-muted-foreground">
              Total General Terms
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 mt-6">
        <Card className="nextrend-card">
          <CardHeader>
            <CardTitle>Latest MBS Commentary</CardTitle>
          </CardHeader>
          <CardContent>
            {latestMBS ? (
              <div>
                <h3 className="font-semibold text-lg">{latestMBS.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {latestMBS.date ? new Date(latestMBS.date).toLocaleDateString() : ""}
                </p>
                <p className="mt-2 line-clamp-3">{latestMBS.description}</p>
                <button 
                  onClick={() => navigate("/mbs-commentary")}
                  className="mt-4 text-nextrend-green hover:text-nextrend-green-dark flex items-center text-sm font-medium"
                >
                  View all commentaries
                </button>
              </div>
            ) : (
              <p className="text-muted-foreground">No MBS commentary articles yet</p>
            )}
          </CardContent>
        </Card>

        <Card className="nextrend-card">
          <CardHeader>
            <CardTitle>Latest Trending Topic</CardTitle>
          </CardHeader>
          <CardContent>
            {latestTrending ? (
              <div>
                <h3 className="font-semibold text-lg">{latestTrending.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {latestTrending.date ? new Date(latestTrending.date).toLocaleDateString() : ""}
                </p>
                <p className="mt-2 line-clamp-3">{latestTrending.description}</p>
                <button 
                  onClick={() => navigate("/trending-topics")}
                  className="mt-4 text-nextrend-green hover:text-nextrend-green-dark flex items-center text-sm font-medium"
                >
                  View all trending topics
                </button>
              </div>
            ) : (
              <p className="text-muted-foreground">No trending topic articles yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
