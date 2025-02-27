import { useState, useEffect } from 'react';
import { FileText, Search, Loader2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Link } from "react-router-dom";
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Artifact {
  name: string;
  path: string;
}

const ArtifactList = () => {
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadArtifacts = async () => {
      try {
        // Get all .tsx files in artifacts directory except index.tsx
        const modules = import.meta.glob('./*.tsx', { eager: true });

        const artifactList = Object.keys(modules)
            .filter(path => !path.endsWith('index.tsx'))
            .map(path => ({
              name: path.replace('./', '').replace('.tsx', ''),
              path: path.replace('./', '')
            }));

        setArtifacts(artifactList);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error loading artifacts:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadArtifacts();
  }, []);

  const filteredArtifacts = artifacts.filter(artifact =>
    artifact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-2xl mx-4">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Available Artifacts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search artifacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : filteredArtifacts.length > 0 ? (
            <div className="space-y-2">
              {filteredArtifacts.map((artifact) => (
                <Link
                  key={artifact.path}
                  to={`/${artifact.path.replace('.tsx', '')}`}
                  className="flex items-center p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <FileText className="h-5 w-5 mr-3 text-muted-foreground" />
                  <span className="font-medium">{artifact.name}</span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No artifacts found
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ArtifactList;
